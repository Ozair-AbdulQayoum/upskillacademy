import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/services/clients";
const SERVER_URL = "http://localhost:5000";

export default function ClientsManagement() {
  const [clients, setClients] = useState([]);

  const [name, setName] = useState("");
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // FETCH CLIENTS
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);

      setClients(response.data?.data || []);
    } catch (err) {
      console.error("Fetch clients error:", err);

      setError(err.response?.data?.message || "Failed to load clients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // LOGO PREVIEW
  useEffect(() => {
    if (!logo) return;

    const objectUrl = URL.createObjectURL(logo);

    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [logo]);

  // HANDLE LOGO SELECTION
  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Logo size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setLogo(file);
  };

  // RESET FORM
  const resetForm = () => {
    setName("");
    setLogo(null);
    setPreview("");
    setEditingId(null);
    setError("");

    const input = document.getElementById("client-logo");

    if (input) input.value = "";
  };

  // EDIT CLIENT
  const handleEdit = (client) => {
    setEditingId(client._id);
    setName(client.name);
    setLogo(null);
    setPreview(`${SERVER_URL}${client.logo}`);

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ADD / UPDATE CLIENT
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter the client name.");
      return;
    }

    if (!editingId && !logo) {
      setError("Please upload a client logo.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("name", name.trim());

      if (logo) {
        formData.append("logo", logo);
      }

      const wasEditing = Boolean(editingId);

      if (wasEditing) {
        await axios.put(`${API_URL}/${editingId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }

      resetForm();
      await fetchClients();

      setSuccess(
        wasEditing
          ? "Client updated successfully."
          : "Client added successfully.",
      );
    } catch (err) {
      console.error("Save client error:", err);

      setError(err.response?.data?.message || "Failed to save client.");
    } finally {
      setSaving(false);
    }
  };

  // DELETE CLIENT
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this client?",
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await axios.delete(`${API_URL}/${id}`);

      if (editingId === id) {
        resetForm();
      }

      await fetchClients();

      setSuccess("Client deleted successfully.");
    } catch (err) {
      console.error("Delete client error:", err);

      setError(err.response?.data?.message || "Failed to delete client.");
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Clients Management
          </h1>

          <p className="text-gray-500 mt-2">
            Manage the clients displayed on your public Services page.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchClients}
          disabled={loading || saving}
          className="px-5 py-2.5 rounded-lg border border-gray-200
          text-gray-700 font-medium hover:bg-gray-50 transition
          disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">
          {success}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600">
          {error}
        </div>
      )}

      {/* ADD / EDIT FORM */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-7 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {editingId ? "Edit Client" : "Add New Client"}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Enter the client name and upload its logo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CLIENT NAME */}
          <div>
            <label
              htmlFor="client-name"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Client Name
            </label>

            <input
              id="client-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter client name"
              maxLength={100}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
              outline-none focus:ring-2 focus:ring-[#009BF5]/30
              focus:border-[#009BF5] transition"
            />
          </div>

          {/* CLIENT LOGO */}
          <div>
            <label
              htmlFor="client-logo"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Client Logo
            </label>

            <input
              id="client-logo"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              onChange={handleLogoChange}
              className="w-full px-4 py-3 border border-gray-300
              rounded-lg text-sm file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0 file:bg-[#009BF5]/10
              file:text-[#009BF5] file:font-semibold"
            />

            <p className="text-xs text-gray-500 mt-2">
              JPG, PNG, WEBP, GIF, or SVG. Maximum 5 MB.
              {editingId && " Leave empty to keep the current logo."}
            </p>
          </div>

          {/* LOGO PREVIEW */}
          {preview && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Logo Preview
              </p>

              <div className="w-full sm:w-64 h-36 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center p-5">
                <img
                  src={preview}
                  alt="Client logo preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* FORM BUTTONS */}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-lg bg-[#009BF5] text-white
              font-semibold hover:bg-blue-600 transition disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Client"
                  : "Add Client"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="px-6 py-3 rounded-lg border border-gray-300
                text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ALL CLIENTS */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">All Clients</h2>

            <p className="text-sm text-gray-500 mt-1">
              Manage your existing client logos.
            </p>
          </div>

          <span className="px-4 py-2 rounded-full bg-[#009BF5]/10 text-[#009BF5] text-sm font-semibold w-fit">
            {clients.length} Clients
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading clients...
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 font-medium">No clients added yet.</p>

            <p className="text-sm text-gray-400 mt-2">
              Add a new client using the form above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {clients.map((client) => (
              <div
                key={client._id}
                className="border border-gray-200 rounded-xl p-5
                hover:border-[#009BF5] hover:shadow-md transition"
              >
                <div className="h-32 flex items-center justify-center bg-gray-50 rounded-lg p-4 mb-4">
                  <img
                    src={`${SERVER_URL}${client.logo}`}
                    alt={`${client.name} logo`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                <h3 className="text-center font-semibold text-gray-800 mb-5">
                  {client.name}
                </h3>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(client)}
                    disabled={saving}
                    className="flex-1 py-2.5 rounded-lg bg-[#009BF5]/10
                    text-[#009BF5] font-semibold text-sm
                    hover:bg-[#009BF5]/20 transition disabled:opacity-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(client._id)}
                    disabled={saving}
                    className="flex-1 py-2.5 rounded-lg bg-red-50
                    text-red-600 font-semibold text-sm
                    hover:bg-red-100 transition disabled:opacity-50"
                  >
                    Delete
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
