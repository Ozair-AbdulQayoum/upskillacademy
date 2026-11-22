import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MessageSquare,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  RefreshCw,
  MapPin,
  Mail,
  Phone,
  Link as LinkIcon,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/about";

const emptyContact = {
  label: "",
  value: "",
  href: "",
  icon: "location",
};

const iconOptions = [
  { value: "location", label: "Location", Icon: MapPin },
  { value: "email", label: "Email", Icon: Mail },
  { value: "phone", label: "Phone", Icon: Phone },
];

export default function FeedbackManagement() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    formTitle: "",
    formDescription: "",
  });

  const [contactItems, setContactItems] = useState([]);
  const [contactForm, setContactForm] = useState(emptyContact);
  const [editingIndex, setEditingIndex] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contactSaving, setContactSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_URL}/feedback`);
      const data = response.data.data || response.data;

      setFormData({
        title: data.title || "",
        description: data.description || "",
        formTitle: data.formTitle || "",
        formDescription: data.formDescription || "",
      });

      setContactItems(data.contactItems || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load feedback content.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleMainChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  const saveFeedbackContent = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await axios.put(`${API_URL}/feedback`, formData);

      setMessage("Feedback form content saved successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save feedback content.",
      );
    } finally {
      setSaving(false);
    }
  };

  const resetContactForm = () => {
    setContactForm(emptyContact);
    setEditingIndex(null);
  };

  const saveContact = async (e) => {
    e.preventDefault();

    if (!contactForm.label.trim() || !contactForm.value.trim()) {
      setError("Please enter both contact label and value.");
      return;
    }

    try {
      setContactSaving(true);
      setError("");
      setMessage("");

      if (editingIndex !== null) {
        await axios.patch(
          `${API_URL}/content/feedback/contactItems/${editingIndex}`,
          contactForm,
        );

        setMessage("Contact item updated successfully.");
      } else {
        await axios.post(
          `${API_URL}/content/feedback/contactItems`,
          contactForm,
        );

        setMessage("Contact item added successfully.");
      }

      resetContactForm();
      await fetchFeedback();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save contact information.",
      );
    } finally {
      setContactSaving(false);
    }
  };

  const editContact = (index) => {
    const item = contactItems[index];

    setContactForm({
      label: item.label || "",
      value: item.value || "",
      href: item.href || "",
      icon: item.icon || "location",
    });

    setEditingIndex(index);
    setError("");
    setMessage("");
  };

  const deleteContact = async (index) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contact item?",
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await axios.delete(`${API_URL}/content/feedback/contactItems/${index}`);

      setMessage("Contact item deleted successfully.");
      await fetchFeedback();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete contact item.");
    }
  };

  const getContactIcon = (icon) => {
    const selected = iconOptions.find((item) => item.value === icon);
    const Icon = selected?.Icon || LinkIcon;
    return <Icon size={20} />;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
        <RefreshCw className="animate-spin mx-auto text-[#009FF6]" size={28} />
        <p className="text-gray-500 mt-3">Loading feedback content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#EAF6FF] text-[#009FF6] flex items-center justify-center">
              <MessageSquare size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#101828]">
                Feedback Form Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage feedback form content and contact information.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchFeedback}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm">
          {message}
        </div>
      )}

      {/* Feedback Content */}
      <form
        onSubmit={saveFeedbackContent}
        className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5"
      >
        <div>
          <h2 className="text-lg font-bold text-[#101828]">
            Feedback Section Content
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage the heading and form text displayed on your website.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleMainChange}
              placeholder="Share Your Feedback"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#009FF6]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Form Title
            </label>
            <input
              type="text"
              name="formTitle"
              value={formData.formTitle}
              onChange={handleMainChange}
              placeholder="Send Us a Message"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#009FF6]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleMainChange}
            rows="3"
            placeholder="Enter section description..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#009FF6] resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Form Description
          </label>
          <textarea
            name="formDescription"
            value={formData.formDescription}
            onChange={handleMainChange}
            rows="3"
            placeholder="Enter form description..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#009FF6] resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-[#009FF6] hover:bg-[#0087D1] disabled:opacity-60 text-white px-5 py-3 rounded-xl font-medium"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Feedback Content"}
        </button>
      </form>

      {/* Contact Form */}
      <form
        onSubmit={saveContact}
        className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5"
      >
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#101828]">
              {editingIndex !== null
                ? "Edit Contact Information"
                : "Add Contact Information"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage the contact details shown beside the feedback form.
            </p>
          </div>

          {editingIndex !== null && (
            <button
              type="button"
              onClick={resetContactForm}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600"
            >
              <X size={17} />
              Cancel
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Label
            </label>
            <input
              type="text"
              name="label"
              value={contactForm.label}
              onChange={handleContactChange}
              placeholder="Email Address"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#009FF6]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value
            </label>
            <input
              type="text"
              name="value"
              value={contactForm.value}
              onChange={handleContactChange}
              placeholder="info@example.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#009FF6]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link / Href
            </label>
            <input
              type="text"
              name="href"
              value={contactForm.href}
              onChange={handleContactChange}
              placeholder="mailto:info@example.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#009FF6]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <select
              name="icon"
              value={contactForm.icon}
              onChange={handleContactChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#009FF6] bg-white"
            >
              {iconOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={contactSaving}
          className="flex items-center gap-2 bg-[#009FF6] hover:bg-[#0087D1] disabled:opacity-60 text-white px-5 py-3 rounded-xl font-medium"
        >
          {editingIndex !== null ? <Save size={18} /> : <Plus size={18} />}
          {contactSaving
            ? "Saving..."
            : editingIndex !== null
              ? "Update Contact"
              : "Add Contact"}
        </button>
      </form>

      {/* Contact Items */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-[#101828]">
            Contact Information
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {contactItems.length} contact item(s)
          </p>
        </div>

        {contactItems.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <MessageSquare size={32} className="mx-auto mb-3 text-gray-300" />
            <p>No contact information added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contactItems.map((item, index) => (
              <div
                key={item._id || index}
                className="border border-gray-200 rounded-xl p-4 flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-[#EAF6FF] text-[#009FF6] flex items-center justify-center shrink-0">
                  {getContactIcon(item.icon)}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800">{item.label}</h3>
                  <p className="text-sm text-gray-500 break-words mt-1">
                    {item.value}
                  </p>
                  {item.href && (
                    <p className="text-xs text-gray-400 break-all mt-1">
                      {item.href}
                    </p>
                  )}
                </div>

                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => editContact(index)}
                    title="Edit contact"
                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteContact(index)}
                    title="Delete contact"
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={17} />
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
