import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SERVER_BASE = API_BASE.replace(/\/api\/?$/, "");

const initialHero = {
  label: "",
  heading: "",
  highlightedHeading: "",
  description: "",
  primaryButtonText: "",
  primaryButtonLink: "",
  secondaryButtonText: "",
  secondaryButtonLink: "",
  images: {
    image1: "",
    image2: "",
    image3: "",
  },
  isVisible: true,
};

const imageFields = [
  { name: "image1", label: "First Image" },
  { name: "image2", label: "Second Image" },
  { name: "image3", label: "Third Image" },
];

const EmployersHeroManagement = () => {
  const [hero, setHero] = useState(initialHero);
  const [files, setFiles] = useState({
    image1: null,
    image2: null,
    image3: null,
  });

  const [previews, setPreviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [visibilityLoading, setVisibilityLoading] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // ==========================================
  // FETCH HERO DATA
  // ==========================================

  const fetchHero = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/employers/hero`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load Hero content.");
      }

      setHero({
        ...initialHero,
        ...data.hero,
        images: {
          ...initialHero.images,
          ...data.hero?.images,
        },
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Unable to load Hero content.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  // ==========================================
  // HANDLE TEXT INPUTS
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setHero((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // HANDLE IMAGE UPLOADS
  // ==========================================

  const handleImageChange = (event, imageKey) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({
        type: "error",
        text: "Please select a valid image.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Image size must not exceed 5MB.",
      });
      return;
    }

    setFiles((previous) => ({
      ...previous,
      [imageKey]: file,
    }));

    setPreviews((previous) => ({
      ...previous,
      [imageKey]: URL.createObjectURL(file),
    }));

    setMessage({ type: "", text: "" });
  };

  // ==========================================
  // SAVE HERO CONTENT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      const formData = new FormData();

      formData.append("label", hero.label);
      formData.append("heading", hero.heading);
      formData.append("highlightedHeading", hero.highlightedHeading);
      formData.append("description", hero.description);
      formData.append("primaryButtonText", hero.primaryButtonText);
      formData.append("primaryButtonLink", hero.primaryButtonLink);
      formData.append("secondaryButtonText", hero.secondaryButtonText);
      formData.append("secondaryButtonLink", hero.secondaryButtonLink);

      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });

      const response = await fetch(`${API_BASE}/employers/hero`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save Hero content.");
      }

      setHero((previous) => ({
        ...previous,
        ...data.hero,
        images: {
          ...previous.images,
          ...data.hero?.images,
        },
      }));

      setFiles({
        image1: null,
        image2: null,
        image3: null,
      });

      setPreviews({});

      setMessage({
        type: "success",
        text: "Hero section updated successfully!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Something went wrong.",
      });
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // TOGGLE VISIBILITY
  // ==========================================

  const handleVisibility = async () => {
    try {
      setVisibilityLoading(true);

      const newVisibility = !hero.isVisible;

      const response = await fetch(`${API_BASE}/employers/hero/visibility`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isVisible: newVisibility,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update visibility.");
      }

      setHero((previous) => ({
        ...previous,
        isVisible: data.hero?.isVisible ?? newVisibility,
      }));

      setMessage({
        type: "success",
        text: newVisibility
          ? "Hero section published successfully."
          : "Hero section hidden successfully.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Unable to update visibility.",
      });
    } finally {
      setVisibilityLoading(false);
    }
  };

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (imageKey) => {
    if (previews[imageKey]) {
      return previews[imageKey];
    }

    const imagePath = hero.images?.[imageKey];

    if (!imagePath) return "";

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    return `${SERVER_BASE}${imagePath}`;
  };

  // ==========================================
  // CLEANUP PREVIEW URLS
  // ==========================================

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="ehm-loading">
        <div className="ehm-spinner"></div>
        <p>Loading Employers Hero...</p>
      </div>
    );
  }

  return (
    <div className="ehm-container">
      {/* HEADER */}

      <div className="ehm-header">
        <div>
          <span className="ehm-eyebrow">EMPLOYERS PAGE</span>
          <h1>Hero Section Management</h1>
          <p>
            Manage the main banner content displayed on your Employers page.
          </p>
        </div>

        <button
          type="button"
          className={`ehm-visibility ${
            hero.isVisible ? "ehm-published" : "ehm-hidden"
          }`}
          onClick={handleVisibility}
          disabled={visibilityLoading}
        >
          {visibilityLoading
            ? "Updating..."
            : hero.isVisible
              ? "● Published"
              : "○ Hidden"}
        </button>
      </div>

      {/* MESSAGE */}

      {message.text && (
        <div className={`ehm-message ehm-${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit}>
        {/* TEXT CONTENT */}

        <section className="ehm-card">
          <div className="ehm-section-heading">
            <div>
              <h2>Hero Content</h2>
              <p>Update the heading and description.</p>
            </div>
          </div>

          <div className="ehm-grid">
            <div className="ehm-field">
              <label>Small Label</label>
              <input
                type="text"
                name="label"
                value={hero.label}
                onChange={handleChange}
                placeholder="For employers"
              />
            </div>

            <div className="ehm-field">
              <label>Main Heading</label>
              <input
                type="text"
                name="heading"
                value={hero.heading}
                onChange={handleChange}
                placeholder="Hire trained junior talent."
              />
            </div>

            <div className="ehm-field ehm-full">
              <label>Highlighted Heading</label>
              <input
                type="text"
                name="highlightedHeading"
                value={hero.highlightedHeading}
                onChange={handleChange}
                placeholder="See the work first."
              />
            </div>

            <div className="ehm-field ehm-full">
              <label>Description</label>
              <textarea
                name="description"
                value={hero.description}
                onChange={handleChange}
                rows="4"
                placeholder="Write your Hero description..."
              />
            </div>
          </div>
        </section>

        {/* BUTTON SETTINGS */}

        <section className="ehm-card">
          <div className="ehm-section-heading">
            <div>
              <h2>Button Settings</h2>
              <p>Configure both Hero buttons and their destination links.</p>
            </div>
          </div>

          <div className="ehm-grid">
            <div className="ehm-field">
              <label>Primary Button Text</label>
              <input
                type="text"
                name="primaryButtonText"
                value={hero.primaryButtonText}
                onChange={handleChange}
                placeholder="Browse talent"
              />
            </div>

            <div className="ehm-field">
              <label>Primary Button Link</label>
              <input
                type="text"
                name="primaryButtonLink"
                value={hero.primaryButtonLink}
                onChange={handleChange}
                placeholder="/student-projects"
              />
            </div>

            <div className="ehm-field">
              <label>Secondary Button Text</label>
              <input
                type="text"
                name="secondaryButtonText"
                value={hero.secondaryButtonText}
                onChange={handleChange}
                placeholder="Corporate training"
              />
            </div>

            <div className="ehm-field">
              <label>Secondary Button Link</label>
              <input
                type="text"
                name="secondaryButtonLink"
                value={hero.secondaryButtonLink}
                onChange={handleChange}
                placeholder="/corporate-training"
              />
            </div>
          </div>
        </section>

        {/* IMAGE SETTINGS */}

        <section className="ehm-card">
          <div className="ehm-section-heading">
            <div>
              <h2>Hero Gallery Images</h2>
              <p>Upload up to three images. Maximum size: 5MB each.</p>
            </div>
          </div>

          <div className="ehm-image-grid">
            {imageFields.map((image) => {
              const imageUrl = getImageUrl(image.name);

              return (
                <div className="ehm-image-item" key={image.name}>
                  <label>{image.label}</label>

                  <div className="ehm-image-preview">
                    {imageUrl ? (
                      <img src={imageUrl} alt={image.label} />
                    ) : (
                      <div className="ehm-empty-image">
                        <span>＋</span>
                        <p>No image uploaded</p>
                      </div>
                    )}
                  </div>

                  <label
                    className="ehm-upload-button"
                    htmlFor={`upload-${image.name}`}
                  >
                    {files[image.name] ? "Change Image" : "Upload Image"}
                  </label>

                  <input
                    id={`upload-${image.name}`}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(event) => handleImageChange(event, image.name)}
                    hidden
                  />

                  {files[image.name] && (
                    <p className="ehm-file-name">{files[image.name].name}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* LIVE PREVIEW */}

        <section className="ehm-card">
          <div className="ehm-section-heading">
            <div>
              <h2>Content Preview</h2>
              <p>Preview your updated Hero content.</p>
            </div>
          </div>

          <div className="ehm-preview">
            <div className="ehm-preview-content">
              <span>{hero.label || "Your label"}</span>

              <h2>
                {hero.heading || "Your main heading"}
                <br />
                <strong>
                  {hero.highlightedHeading || "Your highlighted heading"}
                </strong>
              </h2>

              <p>{hero.description || "Your description will appear here."}</p>

              <div className="ehm-preview-buttons">
                <span>{hero.primaryButtonText || "Primary Button"}</span>
                <span>{hero.secondaryButtonText || "Secondary Button"}</span>
              </div>
            </div>

            <div className="ehm-preview-images">
              {imageFields.map((image) => (
                <div key={image.name}>
                  {getImageUrl(image.name) ? (
                    <img src={getImageUrl(image.name)} alt={image.label} />
                  ) : (
                    <div className="ehm-preview-placeholder">{image.label}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SAVE BUTTON */}

        <div className="ehm-actions">
          <button
            type="button"
            className="ehm-reset-button"
            onClick={() => {
              setFiles({
                image1: null,
                image2: null,
                image3: null,
              });
              setPreviews({});
              fetchHero();
              setMessage({ type: "", text: "" });
            }}
            disabled={saving}
          >
            Reload Content
          </button>

          <button type="submit" className="ehm-save-button" disabled={saving}>
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* COMPONENT STYLES */}

      <style>{`
        .ehm-container {
          width: 100%;
          padding: 28px;
          color: #1e293b;
          font-family: inherit;
        }

        .ehm-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 28px;
        }

        .ehm-eyebrow {
          color: #0d9488;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
        }

        .ehm-header h1 {
          font-size: 27px;
          margin: 8px 0;
          font-weight: 700;
        }

        .ehm-header p,
        .ehm-section-heading p {
          color: #64748b;
          font-size: 14px;
          margin: 0;
        }

        .ehm-visibility {
          border: 0;
          padding: 11px 17px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }

        .ehm-published {
          color: #047857;
          background: #d1fae5;
        }

        .ehm-hidden {
          color: #b45309;
          background: #fef3c7;
        }

        .ehm-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 22px;
        }

        .ehm-section-heading {
          margin-bottom: 23px;
        }

        .ehm-section-heading h2 {
          font-size: 18px;
          margin: 0 0 6px;
          font-weight: 700;
        }

        .ehm-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .ehm-field {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .ehm-full {
          grid-column: 1 / -1;
        }

        .ehm-field label,
        .ehm-image-item > label:first-child {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
        }

        .ehm-field input,
        .ehm-field textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 12px 13px;
          font-size: 14px;
          outline: none;
          background: #fff;
          color: #1e293b;
          font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .ehm-field input:focus,
        .ehm-field textarea:focus {
          border-color: #0d9488;
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
        }

        .ehm-field textarea {
          resize: vertical;
        }

        .ehm-image-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .ehm-image-item {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 0;
        }

        .ehm-image-preview {
          height: 190px;
          overflow: hidden;
          border: 1px dashed #cbd5e1;
          border-radius: 10px;
          background: #f8fafc;
        }

        .ehm-image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ehm-empty-image {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
        }

        .ehm-empty-image span {
          font-size: 35px;
        }

        .ehm-empty-image p {
          font-size: 13px;
        }

        .ehm-upload-button {
          display: block;
          padding: 10px;
          text-align: center;
          background: #f0fdfa;
          color: #0f766e;
          border: 1px solid #99f6e4;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .ehm-upload-button:hover {
          background: #ccfbf1;
        }

        .ehm-file-name {
          margin: 0;
          font-size: 12px;
          color: #64748b;
          overflow-wrap: anywhere;
        }

        .ehm-preview {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 25px;
          align-items: center;
          padding: 28px;
          background: #f8fafc;
          border-radius: 10px;
        }

        .ehm-preview-content > span {
          color: #0d9488;
          font-size: 13px;
          font-weight: 700;
        }

        .ehm-preview-content h2 {
          font-size: clamp(22px, 3vw, 34px);
          line-height: 1.25;
          margin: 12px 0;
          color: #0f172a;
        }

        .ehm-preview-content h2 strong {
          color: #0d9488;
        }

        .ehm-preview-content > p {
          color: #64748b;
          font-size: 14px;
          line-height: 1.7;
        }

        .ehm-preview-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 20px;
        }

        .ehm-preview-buttons span {
          background: #0d9488;
          color: white;
          border-radius: 7px;
          padding: 10px 13px;
          font-size: 12px;
          font-weight: 600;
        }

        .ehm-preview-buttons span + span {
          background: white;
          color: #0d9488;
          border: 1px solid #0d9488;
        }

        .ehm-preview-images {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .ehm-preview-images > div {
          height: 110px;
          overflow: hidden;
          border-radius: 8px;
          background: #e2e8f0;
        }

        .ehm-preview-images > div:first-child {
          grid-row: span 2;
          height: 228px;
        }

        .ehm-preview-images img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ehm-preview-placeholder {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          color: #64748b;
          font-size: 12px;
        }

        .ehm-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding-bottom: 25px;
        }

        .ehm-actions button {
          border: 0;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .ehm-reset-button {
          background: #f1f5f9;
          color: #475569;
        }

        .ehm-save-button {
          background: #0d9488;
          color: white;
        }

        .ehm-save-button:hover {
          background: #0f766e;
        }

        .ehm-actions button:disabled,
        .ehm-visibility:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .ehm-message {
          padding: 13px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .ehm-success {
          color: #047857;
          background: #d1fae5;
        }

        .ehm-error {
          color: #b91c1c;
          background: #fee2e2;
        }

        .ehm-loading {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 15px;
          color: #64748b;
        }

        .ehm-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #ccfbf1;
          border-top-color: #0d9488;
          border-radius: 50%;
          animation: ehm-spin 0.8s linear infinite;
        }

        @keyframes ehm-spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 900px) {
          .ehm-image-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ehm-preview {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .ehm-container {
            padding: 15px;
          }

          .ehm-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .ehm-grid,
          .ehm-image-grid {
            grid-template-columns: 1fr;
          }

          .ehm-card {
            padding: 17px;
          }

          .ehm-actions {
            flex-direction: column-reverse;
          }

          .ehm-actions button {
            width: 100%;
          }

          .ehm-preview {
            padding: 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default EmployersHeroManagement;
