import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Save,
  Plus,
  Trash2,
  Loader2,
  RotateCcw,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/site-settings";

const defaultFooter = {
  brandName: "Upskill Academy",
  description: "",
  poweredByText: "",
  socialLinks: [],
  qrCode: "",
  columns: [
    {
      title: "Services",
      links: [],
    },
    {
      title: "Helpful Links",
      links: [],
    },
    {
      title: "Information",
      links: [],
    },
  ],
  location: "",
  phone: "",
  phoneLink: "",
  copyrightText: "",
  bottomLinks: [],
};

export default function FooterManagement() {
  const [footer, setFooter] = useState(defaultFooter);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [expandedColumns, setExpandedColumns] = useState({});

  // Fetch footer settings
  const fetchFooter = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_URL}/footer`);

      if (response.data?.data) {
        setFooter({
          ...defaultFooter,
          ...response.data.data,
          socialLinks: response.data.data.socialLinks || [],
          columns: response.data.data.columns || defaultFooter.columns,
          bottomLinks: response.data.data.bottomLinks || [],
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load footer settings.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooter();
  }, []);

  // Update normal fields
  const updateField = (field, value) => {
    setFooter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Social links
  const updateSocialLink = (index, field, value) => {
    setFooter((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addSocialLink = () => {
    setFooter((prev) => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        { name: "Facebook", url: "", isVisible: true },
      ],
    }));
  };

  const deleteSocialLink = (index) => {
    setFooter((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  };

  // Footer columns
  const updateColumn = (columnIndex, field, value) => {
    setFooter((prev) => ({
      ...prev,
      columns: prev.columns.map((column, i) =>
        i === columnIndex ? { ...column, [field]: value } : column,
      ),
    }));
  };

  const addColumn = () => {
    setFooter((prev) => ({
      ...prev,
      columns: [...prev.columns, { title: "New Column", links: [] }],
    }));
  };

  const deleteColumn = (index) => {
    setFooter((prev) => ({
      ...prev,
      columns: prev.columns.filter((_, i) => i !== index),
    }));
  };

  // Links inside footer columns
  const updateColumnLink = (columnIndex, linkIndex, field, value) => {
    setFooter((prev) => ({
      ...prev,
      columns: prev.columns.map((column, i) =>
        i === columnIndex
          ? {
              ...column,
              links: column.links.map((link, j) =>
                j === linkIndex ? { ...link, [field]: value } : link,
              ),
            }
          : column,
      ),
    }));
  };

  const addColumnLink = (columnIndex) => {
    setFooter((prev) => ({
      ...prev,
      columns: prev.columns.map((column, i) =>
        i === columnIndex
          ? {
              ...column,
              links: [
                ...column.links,
                {
                  name: "New Link",
                  path: "/",
                  order: column.links.length + 1,
                  isVisible: true,
                },
              ],
            }
          : column,
      ),
    }));
  };

  const deleteColumnLink = (columnIndex, linkIndex) => {
    setFooter((prev) => ({
      ...prev,
      columns: prev.columns.map((column, i) =>
        i === columnIndex
          ? {
              ...column,
              links: column.links.filter((_, j) => j !== linkIndex),
            }
          : column,
      ),
    }));
  };

  // Bottom links
  const updateBottomLink = (index, field, value) => {
    setFooter((prev) => ({
      ...prev,
      bottomLinks: prev.bottomLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link,
      ),
    }));
  };

  const addBottomLink = () => {
    setFooter((prev) => ({
      ...prev,
      bottomLinks: [
        ...prev.bottomLinks,
        {
          name: "New Link",
          path: "/",
          order: prev.bottomLinks.length + 1,
          isVisible: true,
        },
      ],
    }));
  };

  const deleteBottomLink = (index) => {
    setFooter((prev) => ({
      ...prev,
      bottomLinks: prev.bottomLinks.filter((_, i) => i !== index),
    }));
  };

  // Save footer
  const saveFooter = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await axios.put(`${API_URL}/footer`, footer);

      setMessage(
        response.data?.message || "Footer settings saved successfully!",
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save footer settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleColumn = (index) => {
    setExpandedColumns((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
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
            <LayoutGrid size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#101828]">
              Footer Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your website footer content and links.
            </p>
          </div>
        </div>

        <button
          onClick={fetchFooter}
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

      {/* Brand Settings */}
      <Section title="Brand Information">
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Brand Name"
            value={footer.brandName}
            onChange={(v) => updateField("brandName", v)}
          />

          <Input
            label="Powered By Text"
            value={footer.poweredByText}
            onChange={(v) => updateField("poweredByText", v)}
          />

          <div className="md:col-span-2">
            <TextArea
              label="Footer Description"
              value={footer.description}
              onChange={(v) => updateField("description", v)}
            />
          </div>
        </div>
      </Section>

      {/* Social Links */}
      <Section
        title="Social Media Links"
        action={<AddButton onClick={addSocialLink}>Add Social Link</AddButton>}
      >
        {footer.socialLinks.length === 0 && (
          <EmptyMessage>No social links added yet.</EmptyMessage>
        )}

        <div className="space-y-3">
          {footer.socialLinks.map((social, index) => (
            <div
              key={index}
              className="grid gap-4 rounded-xl border border-gray-200 p-4 md:grid-cols-12 md:items-end"
            >
              <div className="md:col-span-4">
                <Input
                  label="Platform Name"
                  value={social.name}
                  onChange={(v) => updateSocialLink(index, "name", v)}
                  placeholder="Facebook"
                />
              </div>

              <div className="md:col-span-6">
                <Input
                  label="Profile URL"
                  value={social.url}
                  onChange={(v) => updateSocialLink(index, "url", v)}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              <VisibilityToggle
                checked={social.isVisible}
                onChange={(v) => updateSocialLink(index, "isVisible", v)}
              />

              <DeleteButton onClick={() => deleteSocialLink(index)} />
            </div>
          ))}
        </div>
      </Section>

      {/* QR Code */}
      <Section title="QR Code">
        <Input
          label="QR Code Image URL"
          value={footer.qrCode}
          onChange={(v) => updateField("qrCode", v)}
          placeholder="https://example.com/qr-code.png"
        />

        {footer.qrCode && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-gray-500">
              QR Code Preview
            </p>
            <img
              src={footer.qrCode}
              alt="Footer QR Code"
              className="h-36 w-36 rounded-lg border border-gray-200 object-contain p-2"
            />
          </div>
        )}
      </Section>

      {/* Footer Columns */}
      <Section
        title="Footer Columns"
        description="Manage footer sections such as Services, Helpful Links and Information."
        action={<AddButton onClick={addColumn}>Add Column</AddButton>}
      >
        <div className="space-y-4">
          {footer.columns.map((column, columnIndex) => (
            <div
              key={columnIndex}
              className="overflow-hidden rounded-xl border border-gray-200"
            >
              <div className="flex flex-wrap items-center gap-3 bg-gray-50 p-4">
                <div className="flex-1">
                  <Input
                    label="Column Title"
                    value={column.title}
                    onChange={(v) => updateColumn(columnIndex, "title", v)}
                  />
                </div>

                <button
                  onClick={() => toggleColumn(columnIndex)}
                  className="mt-6 rounded-lg border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-100"
                  title="Expand or collapse"
                >
                  {expandedColumns[columnIndex] ? (
                    <ChevronUp size={19} />
                  ) : (
                    <ChevronDown size={19} />
                  )}
                </button>

                <button
                  onClick={() => deleteColumn(columnIndex)}
                  className="mt-6 rounded-lg p-2 text-red-500 hover:bg-red-50"
                  title="Delete column"
                >
                  <Trash2 size={19} />
                </button>
              </div>

              {expandedColumns[columnIndex] && (
                <div className="space-y-4 p-4">
                  <div className="flex justify-end">
                    <AddButton onClick={() => addColumnLink(columnIndex)}>
                      Add Link
                    </AddButton>
                  </div>

                  {column.links.length === 0 && (
                    <EmptyMessage>No links in this column.</EmptyMessage>
                  )}

                  {column.links.map((link, linkIndex) => (
                    <div
                      key={linkIndex}
                      className="grid gap-3 rounded-lg border border-gray-100 p-3 md:grid-cols-12 md:items-end"
                    >
                      <div className="md:col-span-4">
                        <Input
                          label="Link Name"
                          value={link.name}
                          onChange={(v) =>
                            updateColumnLink(columnIndex, linkIndex, "name", v)
                          }
                        />
                      </div>

                      <div className="md:col-span-4">
                        <Input
                          label="URL / Path"
                          value={link.path}
                          onChange={(v) =>
                            updateColumnLink(columnIndex, linkIndex, "path", v)
                          }
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Input
                          label="Order"
                          type="number"
                          value={link.order}
                          onChange={(v) =>
                            updateColumnLink(
                              columnIndex,
                              linkIndex,
                              "order",
                              Number(v),
                            )
                          }
                        />
                      </div>

                      <VisibilityToggle
                        checked={link.isVisible}
                        onChange={(v) =>
                          updateColumnLink(
                            columnIndex,
                            linkIndex,
                            "isVisible",
                            v,
                          )
                        }
                      />

                      <DeleteButton
                        onClick={() => deleteColumnLink(columnIndex, linkIndex)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Contact Information */}
      <Section title="Contact Information">
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Location"
            value={footer.location}
            onChange={(v) => updateField("location", v)}
            placeholder="Kabul, Afghanistan"
          />

          <Input
            label="Phone Number"
            value={footer.phone}
            onChange={(v) => updateField("phone", v)}
            placeholder="+93 ..."
          />

          <div className="md:col-span-2">
            <Input
              label="Phone Link"
              value={footer.phoneLink}
              onChange={(v) => updateField("phoneLink", v)}
              placeholder="tel:+93..."
            />
          </div>
        </div>
      </Section>

      {/* Bottom Links */}
      <Section
        title="Bottom Links"
        action={<AddButton onClick={addBottomLink}>Add Bottom Link</AddButton>}
      >
        {footer.bottomLinks.length === 0 && (
          <EmptyMessage>No bottom links added yet.</EmptyMessage>
        )}

        <div className="space-y-3">
          {footer.bottomLinks.map((link, index) => (
            <div
              key={index}
              className="grid gap-4 rounded-xl border border-gray-200 p-4 md:grid-cols-12 md:items-end"
            >
              <div className="md:col-span-4">
                <Input
                  label="Link Name"
                  value={link.name}
                  onChange={(v) => updateBottomLink(index, "name", v)}
                />
              </div>

              <div className="md:col-span-4">
                <Input
                  label="URL / Path"
                  value={link.path}
                  onChange={(v) => updateBottomLink(index, "path", v)}
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Order"
                  type="number"
                  value={link.order}
                  onChange={(v) => updateBottomLink(index, "order", Number(v))}
                />
              </div>

              <VisibilityToggle
                checked={link.isVisible}
                onChange={(v) => updateBottomLink(index, "isVisible", v)}
              />

              <DeleteButton onClick={() => deleteBottomLink(index)} />
            </div>
          ))}
        </div>
      </Section>

      {/* Copyright */}
      <Section title="Copyright Information">
        <TextArea
          label="Copyright Text"
          value={footer.copyrightText}
          onChange={(v) => updateField("copyrightText", v)}
          placeholder="© 2026 Upskill Academy. All rights reserved."
        />
      </Section>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={saveFooter}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-[#009FF6] px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-600 disabled:opacity-60"
        >
          {saving ? (
            <Loader2 size={19} className="animate-spin" />
          ) : (
            <Save size={19} />
          )}
          {saving ? "Saving..." : "Save Footer Settings"}
        </button>
      </div>
    </div>
  );
}

// Reusable Section
function Section({ title, description, action, children }) {
  return (
    <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#101828]">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
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

// Reusable Textarea
function TextArea({ label, value, onChange, placeholder = "" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        rows={4}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#009FF6] focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

// Reusable Add Button
function AddButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg bg-[#009FF6] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
    >
      <Plus size={16} />
      {children}
    </button>
  );
}

// Reusable Delete Button
function DeleteButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg p-2 text-red-500 hover:bg-red-50"
      title="Delete"
    >
      <Trash2 size={19} />
    </button>
  );
}

// Reusable Visibility Toggle
function VisibilityToggle({ checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-600 md:col-span-2">
      <input
        type="checkbox"
        checked={checked !== false}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[#009FF6]"
      />
      Visible
    </label>
  );
}

// Empty State
function EmptyMessage({ children }) {
  return (
    <p className="rounded-lg border border-dashed border-gray-200 p-5 text-center text-sm text-gray-400">
      {children}
    </p>
  );
}
