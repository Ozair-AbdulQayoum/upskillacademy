import React, { useEffect, useState } from "react";
import {
  ImagePlus,
  Pencil,
  Trash2,
  RefreshCw,
  Save,
  X,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import api from "../../../services/api";

const isValidImageUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

export default function GalleryManagement() {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [failedImages, setFailedImages] = useState({});

  // =====================================
  // FETCH GALLERY DATA
  // =====================================
  const fetchGallery = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      setError("");

      const [galleryResponse, imageResponse] = await Promise.all([
        api.get("/about/gallery"),
        api.get("/about/content/gallery/images"),
      ]);

      const gallery = galleryResponse.data?.data || galleryResponse.data;

      const imageData = imageResponse.data?.data ?? imageResponse.data;

      setDescription(gallery?.description || "");

      // Support string arrays and { value } arrays.
      const normalizedImages = Array.isArray(imageData)
        ? imageData
            .map((item) => (typeof item === "string" ? item : item?.value))
            .filter(Boolean)
        : [];

      setImages(normalizedImages);
      setFailedImages({});
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load gallery.");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // =====================================
  // HANDLE IMAGE INPUT
  // =====================================
  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
    setMessage("");
    setError("");
  };

  // =====================================
  // ADD IMAGE
  // =====================================
  const addImage = async (e) => {
    e.preventDefault();

    if (saving) return;

    const url = imageUrl.trim();

    if (!url) {
      setError("Please enter an image URL.");
      return;
    }

    if (!isValidImageUrl(url)) {
      setError("Please enter a valid HTTP or HTTPS image URL.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await api.post("/about/content/gallery/images", {
        value: url,
      });

      setImageUrl("");
      setMessage("Image added successfully.");

      await fetchGallery(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add image.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // START EDITING
  // =====================================
  const startEdit = (index) => {
    setEditingIndex(index);
    setImageUrl(images[index]);
    setError("");
    setMessage("");
  };

  // =====================================
  // UPDATE IMAGE
  // =====================================
  const updateImage = async (e) => {
    e.preventDefault();

    if (saving || editingIndex === null) return;

    const url = imageUrl.trim();

    if (!url) {
      setError("Please enter an image URL.");
      return;
    }

    if (!isValidImageUrl(url)) {
      setError("Please enter a valid HTTP or HTTPS image URL.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await api.patch(`/about/content/gallery/images/${editingIndex}`, {
        value: url,
      });

      setEditingIndex(null);
      setImageUrl("");
      setMessage("Image updated successfully.");

      await fetchGallery(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update image.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // DELETE IMAGE
  // =====================================
  const deleteImage = async (index) => {
    if (saving) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete Image ${index + 1}?`,
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await api.delete(`/about/content/gallery/images/${index}`);

      // Cancel editing if the deleted image was being edited.
      if (editingIndex === index) {
        setEditingIndex(null);
        setImageUrl("");
      } else if (editingIndex !== null && editingIndex > index) {
        setEditingIndex((prev) => prev - 1);
      }

      setMessage("Image deleted successfully.");

      await fetchGallery(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete image.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // SAVE DESCRIPTION
  // =====================================
  const saveDescription = async () => {
    if (saving) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await api.put("/about/gallery", {
        description: description.trim(),
      });

      setMessage("Gallery description saved successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save description.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // CANCEL EDIT
  // =====================================
  const cancelEdit = () => {
    setEditingIndex(null);
    setImageUrl("");
    setError("");
    setMessage("");
  };

  // =====================================
  // IMAGE ERROR HANDLER
  // =====================================
  const handleImageError = (image) => {
    setFailedImages((prev) => ({
      ...prev,
      [image]: true,
    }));
  };

  // =====================================
  // LOADING STATE
  // =====================================
  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <LoaderCircle className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gallery Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage images displayed on your About page.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setMessage("");
            fetchGallery();
          }}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* MESSAGES */}
      {message && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700"
        >
          <span>✓</span>
          {message}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertCircle size={17} />
          {error}
        </div>
      )}

      {/* GALLERY DESCRIPTION */}
      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-gray-900">
          Gallery Description
        </h2>

        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setMessage("");
            setError("");
          }}
          rows={3}
          maxLength={1000}
          placeholder="Enter gallery description..."
          className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
        />

        <button
          type="button"
          onClick={saveDescription}
          disabled={saving}
          className="mt-3 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save Description
        </button>
      </section>

      {/* ADD / EDIT IMAGE */}
      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-gray-900">
          {editingIndex !== null ? "Edit Image" : "Add New Image"}
        </h2>

        <form
          onSubmit={editingIndex !== null ? updateImage : addImage}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="url"
            value={imageUrl}
            onChange={handleImageUrlChange}
            placeholder="https://example.com/image.jpg"
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            required
          />

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : editingIndex !== null ? (
              <Save size={17} />
            ) : (
              <ImagePlus size={17} />
            )}

            {saving
              ? "Saving..."
              : editingIndex !== null
                ? "Update Image"
                : "Add Image"}
          </button>

          {editingIndex !== null && (
            <button
              type="button"
              onClick={cancelEdit}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-lg border px-4 py-3 hover:bg-gray-50 disabled:opacity-50"
            >
              <X size={17} />
              Cancel
            </button>
          )}
        </form>
      </section>

      {/* IMAGE GRID */}
      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Gallery Images</h2>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            {images.length} Images
          </span>
        </div>

        {images.length === 0 ? (
          <div className="rounded-lg border border-dashed p-10 text-center text-gray-500">
            No gallery images found. Add your first image above.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <div
                key={`${index}-${image}`}
                className="overflow-hidden rounded-xl border"
              >
                <div className="relative h-52 w-full bg-gray-100">
                  {!failedImages[image] ? (
                    <img
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      className="h-full w-full object-cover"
                      onError={() => handleImageError(image)}
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-gray-500">
                      <AlertCircle size={25} />
                      Image could not be loaded
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-3">
                  <span className="text-sm font-medium text-gray-700">
                    Image {index + 1}
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(index)}
                      disabled={saving}
                      title="Edit image"
                      className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteImage(index)}
                      disabled={saving}
                      title="Delete image"
                      className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
