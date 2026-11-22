import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Save,
  Plus,
  Trash2,
  Loader2,
  RotateCcw,
  Navigation,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/site-settings";

const defaultNavbar = {
  logo: {
    image: "",
    alt: "Upskill Academy",
    link: "/",
  },
  navLinks: [
    { name: "Home", path: "/", order: 1, isVisible: true },
    { name: "Courses", path: "/courses", order: 2, isVisible: true },
    { name: "Testimonials", path: "/testimonials", order: 3, isVisible: true },
    { name: "About", path: "/about", order: 4, isVisible: true },
    { name: "Partners", path: "/partners", order: 5, isVisible: true },
    { name: "Hire Talent", path: "/hire-talent", order: 6, isVisible: true },
  ],
  languages: [
    { name: "English", code: "EN", isVisible: true },
    { name: "دری", code: "FA", isVisible: true },
    { name: "پښتو", code: "PS", isVisible: true },
  ],
  loginButton: {
    label: "Login",
    path: "/login",
    isVisible: true,
  },
  startLearningButton: {
    label: "Start Learning",
    path: "/register",
    isVisible: true,
  },
};

export default function NavbarManagement() {
  const [navbar, setNavbar] = useState(defaultNavbar);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch Navbar Data
  const fetchNavbar = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_URL}/navbar`);

      if (response.data?.data) {
        setNavbar({
          ...defaultNavbar,
          ...response.data.data,
          logo: {
            ...defaultNavbar.logo,
            ...response.data.data.logo,
          },
          loginButton: {
            ...defaultNavbar.loginButton,
            ...response.data.data.loginButton,
          },
          startLearningButton: {
            ...defaultNavbar.startLearningButton,
            ...response.data.data.startLearningButton,
          },
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load navbar settings.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNavbar();
  }, []);

  // Update Nested Fields
  const updateField = (section, field, value) => {
    setNavbar((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Update Navigation Link
  const updateNavLink = (index, field, value) => {
    setNavbar((prev) => ({
      ...prev,
      navLinks: prev.navLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link,
      ),
    }));
  };

  // Add Navigation Link
  const addNavLink = () => {
    setNavbar((prev) => ({
      ...prev,
      navLinks: [
        ...prev.navLinks,
        {
          name: "New Link",
          path: "/new-link",
          order: prev.navLinks.length + 1,
          isVisible: true,
        },
      ],
    }));
  };

  // Delete Navigation Link
  const deleteNavLink = (index) => {
    setNavbar((prev) => ({
      ...prev,
      navLinks: prev.navLinks.filter((_, i) => i !== index),
    }));
  };

  // Update Language
  const updateLanguage = (index, field, value) => {
    setNavbar((prev) => ({
      ...prev,
      languages: prev.languages.map((language, i) =>
        i === index ? { ...language, [field]: value } : language,
      ),
    }));
  };

  // Add Language
  const addLanguage = () => {
    setNavbar((prev) => ({
      ...prev,
      languages: [
        ...prev.languages,
        { name: "New Language", code: "XX", isVisible: true },
      ],
    }));
  };

  // Delete Language
  const deleteLanguage = (index) => {
    setNavbar((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  };

  // Save Navbar
  const saveNavbar = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await axios.put(`${API_URL}/navbar`, navbar);

      if (response.data?.success) {
        setMessage("Navbar settings saved successfully!");
      } else {
        setMessage("Navbar settings updated.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save navbar settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="animate-spin text-[#009FF6]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF6FF] text-[#009FF6]">
            <Navigation size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#101828]">
              Navbar Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your website logo, navigation links and buttons.
            </p>
          </div>
        </div>

        <button
          onClick={fetchNavbar}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <RotateCcw size={16} />
          Reload
        </button>
      </div>

      {/* Notifications */}
      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Logo Settings */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-5 text-lg font-bold text-[#101828]">Logo Settings</h2>

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Logo Image URL"
            value={navbar.logo.image}
            onChange={(value) => updateField("logo", "image", value)}
            placeholder="https://example.com/logo.png"
          />

          <Input
            label="Logo Alt Text"
            value={navbar.logo.alt}
            onChange={(value) => updateField("logo", "alt", value)}
          />

          <Input
            label="Logo Link"
            value={navbar.logo.link}
            onChange={(value) => updateField("logo", "link", value)}
          />
        </div>

        {navbar.logo.image && (
          <div className="mt-5 rounded-xl border border-dashed border-gray-300 p-4">
            <p className="mb-3 text-sm font-medium text-gray-500">
              Logo Preview
            </p>
            <img
              src={navbar.logo.image}
              alt={navbar.logo.alt}
              className="h-16 max-w-[200px] object-contain"
            />
          </div>
        )}
      </section>

      {/* Navigation Links */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#101828]">
              Navigation Links
            </h2>
            <p className="text-sm text-gray-500">
              Add, edit, reorder and control your menu links.
            </p>
          </div>

          <button
            onClick={addNavLink}
            className="flex items-center gap-2 rounded-lg bg-[#009FF6] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
          >
            <Plus size={17} />
            Add Link
          </button>
        </div>

        <div className="space-y-4">
          {navbar.navLinks.map((link, index) => (
            <div
              key={index}
              className="grid gap-4 rounded-xl border border-gray-200 p-4 md:grid-cols-12 md:items-end"
            >
              <div className="md:col-span-3">
                <Input
                  label="Link Name"
                  value={link.name}
                  onChange={(value) => updateNavLink(index, "name", value)}
                />
              </div>

              <div className="md:col-span-4">
                <Input
                  label="URL / Path"
                  value={link.path}
                  onChange={(value) => updateNavLink(index, "path", value)}
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Order"
                  type="number"
                  value={link.order}
                  onChange={(value) =>
                    updateNavLink(index, "order", Number(value))
                  }
                />
              </div>

              <div className="flex items-center gap-2 md:col-span-2">
                <input
                  type="checkbox"
                  checked={link.isVisible}
                  onChange={(e) =>
                    updateNavLink(index, "isVisible", e.target.checked)
                  }
                  className="h-4 w-4 accent-[#009FF6]"
                />
                <span className="text-sm text-gray-600">Visible</span>
              </div>

              <div className="md:col-span-1">
                <button
                  onClick={() => deleteNavLink(index)}
                  title="Delete link"
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={19} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Language Settings */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#101828]">
              Language Settings
            </h2>
            <p className="text-sm text-gray-500">
              Manage the languages displayed in your navbar.
            </p>
          </div>

          <button
            onClick={addLanguage}
            className="flex items-center gap-2 rounded-lg bg-[#009FF6] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
          >
            <Plus size={17} />
            Add Language
          </button>
        </div>

        <div className="space-y-4">
          {navbar.languages.map((language, index) => (
            <div
              key={index}
              className="grid gap-4 rounded-xl border border-gray-200 p-4 md:grid-cols-12 md:items-end"
            >
              <div className="md:col-span-4">
                <Input
                  label="Language Name"
                  value={language.name}
                  onChange={(value) => updateLanguage(index, "name", value)}
                />
              </div>

              <div className="md:col-span-3">
                <Input
                  label="Language Code"
                  value={language.code}
                  onChange={(value) => updateLanguage(index, "code", value)}
                />
              </div>

              <div className="flex items-center gap-2 md:col-span-3">
                <input
                  type="checkbox"
                  checked={language.isVisible}
                  onChange={(e) =>
                    updateLanguage(index, "isVisible", e.target.checked)
                  }
                  className="h-4 w-4 accent-[#009FF6]"
                />
                <span className="text-sm text-gray-600">Visible</span>
              </div>

              <div className="md:col-span-2">
                <button
                  onClick={() => deleteLanguage(index)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={19} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Button Settings */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-5 text-lg font-bold text-[#101828]">
          Navbar Buttons
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <ButtonEditor
            title="Login Button"
            data={navbar.loginButton}
            onChange={(field, value) =>
              updateField("loginButton", field, value)
            }
          />

          <ButtonEditor
            title="Start Learning Button"
            data={navbar.startLearningButton}
            onChange={(field, value) =>
              updateField("startLearningButton", field, value)
            }
          />
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveNavbar}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-[#009FF6] px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="animate-spin" size={19} />
          ) : (
            <Save size={19} />
          )}
          {saving ? "Saving..." : "Save Navbar Settings"}
        </button>
      </div>
    </div>
  );
}

// Reusable Input
function Input({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#009FF6] focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

// Reusable Button Editor
function ButtonEditor({ title, data, onChange }) {
  return (
    <div className="space-y-4 rounded-xl border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-800">{title}</h3>

      <Input
        label="Button Label"
        value={data.label}
        onChange={(value) => onChange("label", value)}
      />

      <Input
        label="Button URL"
        value={data.path}
        onChange={(value) => onChange("path", value)}
      />

      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={data.isVisible}
          onChange={(e) => onChange("isVisible", e.target.checked)}
          className="h-4 w-4 accent-[#009FF6]"
        />
        Show this button
      </label>
    </div>
  );
}
