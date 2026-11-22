import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  HelpCircle,
  X,
  Loader2,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Upload,
  RefreshCw,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

const GALLERY_KEYS = ["image1", "image2", "image3", "image4"];

const createEmptyGallery = () => ({
  image1: { url: "", isVisible: true },
  image2: { url: "", isVisible: true },
  image3: { url: "", isVisible: true },
  image4: { url: "", isVisible: true },
});

const FAQsManagement = () => {
  const [faqs, setFaqs] = useState([]);
  const [gallery, setGallery] = useState(createEmptyGallery);

  const [loading, setLoading] = useState(true);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState("");
  const [deletingKey, setDeletingKey] = useState("");
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });

  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  // ==============================
  // NOTIFICATION
  // ==============================

  const showNotification = (type, message) => {
    setNotification({ type, message });

    setTimeout(() => {
      setNotification({ type: "", message: "" });
    }, 3000);
  };

  // ==============================
  // IMAGE URL
  // ==============================

  const getImageUrl = (url) => {
    if (!url) return "";

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  // ==============================
  // FETCH FAQS
  // ==============================

  const fetchFAQs = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/scholarship/faqs/admin`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch FAQs.");
      }

      const faqList = Array.isArray(result)
        ? result
        : result.faqs || result.data?.faqs || result.data || [];

      setFaqs(Array.isArray(faqList) ? faqList : []);
    } catch (error) {
      showNotification("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // FETCH FAQ GALLERY
  // ==============================

  const fetchGallery = async () => {
    try {
      setGalleryLoading(true);

      const response = await fetch(
        `${API_BASE}/scholarship/faqs/gallery/admin`,
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch FAQ gallery.");
      }

      const galleryData =
        result.gallery || result.data?.gallery || result.data || {};

      setGallery({
        ...createEmptyGallery(),
        ...galleryData,
      });
    } catch (error) {
      showNotification("error", error.message);
    } finally {
      setGalleryLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
    fetchGallery();
  }, []);

  // ==============================
  // OPEN ADD MODAL
  // ==============================

  const handleAdd = () => {
    setEditingFAQ(null);

    setFormData({
      question: "",
      answer: "",
    });

    setShowModal(true);
  };

  // ==============================
  // OPEN EDIT MODAL
  // ==============================

  const handleEdit = (faq) => {
    setEditingFAQ(faq);

    setFormData({
      question: faq.question || "",
      answer: faq.answer || "",
    });

    setShowModal(true);
  };

  // ==============================
  // FORM INPUT
  // ==============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==============================
  // ADD / UPDATE FAQ
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.question.trim() || !formData.answer.trim()) {
      showNotification("error", "Please fill in both fields.");
      return;
    }

    try {
      setSaving(true);

      const isEditing = Boolean(editingFAQ);

      const url = isEditing
        ? `${API_BASE}/scholarship/faqs/${editingFAQ._id}`
        : `${API_BASE}/scholarship/faqs`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: formData.question.trim(),
          answer: formData.answer.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong.");
      }

      showNotification(
        "success",
        isEditing ? "FAQ updated successfully." : "FAQ added successfully.",
      );

      setShowModal(false);

      setFormData({
        question: "",
        answer: "",
      });

      setEditingFAQ(null);

      await fetchFAQs();
    } catch (error) {
      showNotification("error", error.message);
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // DELETE FAQ
  // ==============================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this FAQ?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE}/scholarship/faqs/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete FAQ.");
      }

      setFaqs((prev) => prev.filter((faq) => faq._id !== id));

      showNotification("success", "FAQ deleted successfully.");
    } catch (error) {
      showNotification("error", error.message);
    }
  };

  // ==============================
  // TOGGLE FAQ VISIBILITY
  // ==============================

  const handleToggleVisibility = async (faq) => {
    try {
      const response = await fetch(
        `${API_BASE}/scholarship/faqs/${faq._id}/visibility`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isVisible: !faq.isVisible,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update visibility.");
      }

      setFaqs((prev) =>
        prev.map((item) =>
          item._id === faq._id ? { ...item, isVisible: !faq.isVisible } : item,
        ),
      );

      showNotification(
        "success",
        faq.isVisible
          ? "FAQ hidden successfully."
          : "FAQ published successfully.",
      );
    } catch (error) {
      showNotification("error", error.message);
    }
  };

  // ==================================================
  // FAQ GALLERY MANAGEMENT
  // ==================================================

  // ==============================
  // UPLOAD / REPLACE IMAGE
  // ==============================

  const handleGalleryUpload = async (imageKey, e) => {
    const file = e.target.files?.[0];

    // Allow selecting the same file again later.
    e.target.value = "";

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      showNotification(
        "error",
        "Only JPG, PNG, WEBP and GIF images are allowed.",
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification("error", "Image size must not exceed 5MB.");
      return;
    }

    try {
      setUploadingKey(imageKey);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `${API_BASE}/scholarship/faqs/gallery/${imageKey}`,
        {
          method: "PUT",
          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to upload gallery image.");
      }

      showNotification(
        "success",
        `${imageKey.replace("image", "Image ")} uploaded successfully.`,
      );

      await fetchGallery();
    } catch (error) {
      showNotification("error", error.message);
    } finally {
      setUploadingKey("");
    }
  };

  // ==============================
  // DELETE GALLERY IMAGE
  // ==============================

  const handleDeleteGalleryImage = async (imageKey) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this gallery image?",
    );

    if (!confirmed) return;

    try {
      setDeletingKey(imageKey);

      const response = await fetch(
        `${API_BASE}/scholarship/faqs/gallery/${imageKey}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete gallery image.");
      }

      setGallery((prev) => ({
        ...prev,
        [imageKey]: {
          url: "",
          isVisible: true,
        },
      }));

      if (previewImage?.key === imageKey) {
        setPreviewImage(null);
      }

      showNotification("success", "Gallery image deleted successfully.");

      await fetchGallery();
    } catch (error) {
      showNotification("error", error.message);
    } finally {
      setDeletingKey("");
    }
  };

  // ==============================
  // TOGGLE GALLERY VISIBILITY
  // ==============================

  const handleToggleGalleryVisibility = async (imageKey) => {
    const currentImage = gallery[imageKey];

    if (!currentImage?.url) {
      showNotification("error", "Upload an image first.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/scholarship/faqs/gallery/${imageKey}/visibility`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isVisible: !currentImage.isVisible,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update image visibility.");
      }

      setGallery((prev) => ({
        ...prev,
        [imageKey]: {
          ...prev[imageKey],
          isVisible: !currentImage.isVisible,
        },
      }));

      showNotification(
        "success",
        currentImage.isVisible
          ? "Gallery image hidden successfully."
          : "Gallery image published successfully.",
      );

      await fetchGallery();
    } catch (error) {
      showNotification("error", error.message);
    }
  };

  // ==============================
  // SEARCH
  // ==============================

  const filteredFAQs = faqs.filter((faq) => {
    const searchText = search.toLowerCase();

    return (
      faq.question?.toLowerCase().includes(searchText) ||
      faq.answer?.toLowerCase().includes(searchText)
    );
  });

  const visibleCount = faqs.filter((faq) => faq.isVisible).length;
  const hiddenCount = faqs.length - visibleCount;

  const uploadedImages = GALLERY_KEYS.filter((key) => gallery[key]?.url).length;

  const visibleImages = GALLERY_KEYS.filter(
    (key) => gallery[key]?.url && gallery[key]?.isVisible,
  ).length;

  // ==============================
  // UI
  // ==============================

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <span>Scholarships</span>
              <span>/</span>
              <span className="text-emerald-600">FAQs</span>
            </div>

            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              FAQs Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage frequently asked questions and gallery images on your
              scholarship page.
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <Plus size={18} />
            Add New FAQ
          </button>
        </div>

        {/* NOTIFICATION */}
        {notification.message && (
          <div
            className={`flex items-center gap-3 rounded-xl border p-4 ${
              notification.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}

            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        )}

        {/* FAQ STATISTICS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total FAQs</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                  {faqs.length}
                </h2>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <MessageSquare size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Published FAQs</p>
                <h2 className="mt-2 text-3xl font-bold text-emerald-600">
                  {visibleCount}
                </h2>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <Eye size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Hidden FAQs</p>
                <h2 className="mt-2 text-3xl font-bold text-amber-600">
                  {hiddenCount}
                </h2>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <EyeOff size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            FAQ GALLERY MANAGEMENT
        ================================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* GALLERY HEADER */}
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                <ImageIcon size={23} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-800">
                  FAQ Gallery Images
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage the four images displayed beside your FAQs.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span className="text-slate-500">
                Uploaded:{" "}
                <strong className="text-slate-800">{uploadedImages}/4</strong>
              </span>

              <span className="text-emerald-600">
                Published: <strong>{visibleImages}</strong>
              </span>

              <button
                onClick={fetchGallery}
                disabled={galleryLoading}
                title="Refresh gallery"
                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={galleryLoading ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>

          {/* GALLERY CONTENT */}
          <div className="p-5">
            {galleryLoading ? (
              <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-slate-500">
                <Loader2 size={28} className="animate-spin text-emerald-600" />
                <p className="text-sm">Loading gallery images...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {GALLERY_KEYS.map((imageKey, index) => {
                  const image = gallery[imageKey] || {
                    url: "",
                    isVisible: true,
                  };

                  const imageUrl = getImageUrl(image.url);
                  const isUploading = uploadingKey === imageKey;
                  const isDeleting = deletingKey === imageKey;

                  return (
                    <div
                      key={imageKey}
                      className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-emerald-200"
                    >
                      {/* IMAGE PREVIEW */}
                      <div className="group relative aspect-[4/3] overflow-hidden bg-slate-100">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={`FAQ gallery ${index + 1}`}
                            className={`h-full w-full object-cover transition duration-300 group-hover:scale-105 ${
                              !image.isVisible ? "opacity-50" : ""
                            }`}
                          />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                            <ImageIcon size={35} />
                            <span className="text-sm">No image uploaded</span>
                          </div>
                        )}

                        {imageUrl && (
                          <button
                            onClick={() =>
                              setPreviewImage({
                                key: imageKey,
                                url: imageUrl,
                                title: `Gallery Image ${index + 1}`,
                              })
                            }
                            className="absolute inset-0 flex items-center justify-center bg-slate-900/0 text-white opacity-0 transition group-hover:bg-slate-900/30 group-hover:opacity-100"
                            title="View image"
                          >
                            <span className="flex items-center gap-2 rounded-lg bg-slate-900/70 px-4 py-2 text-sm font-medium">
                              <Eye size={17} />
                              View Image
                            </span>
                          </button>
                        )}

                        {/* STATUS */}
                        {imageUrl && (
                          <span
                            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                              image.isVisible
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {image.isVisible ? "Published" : "Hidden"}
                          </span>
                        )}

                        {/* UPLOAD LOADING */}
                        {isUploading && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/85 text-emerald-700">
                            <Loader2 size={30} className="animate-spin" />
                            <span className="text-sm font-semibold">
                              Uploading...
                            </span>
                          </div>
                        )}
                      </div>

                      {/* IMAGE DETAILS */}
                      <div className="space-y-3 p-4">
                        <div>
                          <h3 className="font-semibold text-slate-800">
                            Gallery Image {index + 1}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            {imageUrl
                              ? "Image is uploaded and stored."
                              : "Upload an image for this gallery slot."}
                          </p>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="grid grid-cols-2 gap-2">
                          {/* UPLOAD / REPLACE */}
                          <label
                            className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700 ${
                              isUploading || isDeleting
                                ? "pointer-events-none opacity-50"
                                : ""
                            }`}
                          >
                            {isUploading ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : imageUrl ? (
                              <RefreshCw size={15} />
                            ) : (
                              <Upload size={15} />
                            )}

                            {imageUrl ? "Replace" : "Upload"}

                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif"
                              className="hidden"
                              disabled={isUploading || isDeleting}
                              onChange={(e) => handleGalleryUpload(imageKey, e)}
                            />
                          </label>

                          {/* HIDE / SHOW */}
                          <button
                            onClick={() =>
                              handleToggleGalleryVisibility(imageKey)
                            }
                            disabled={!imageUrl || isUploading || isDeleting}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {image.isVisible ? (
                              <EyeOff size={15} />
                            ) : (
                              <Eye size={15} />
                            )}

                            {image.isVisible ? "Hide" : "Show"}
                          </button>
                        </div>

                        {/* DELETE */}
                        <button
                          onClick={() => handleDeleteGalleryImage(imageKey)}
                          disabled={!imageUrl || isUploading || isDeleting}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-100 px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {isDeleting ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Trash2 size={15} />
                          )}

                          {isDeleting ? "Deleting..." : "Delete Image"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm leading-6 text-blue-800">
                <strong>Image requirements:</strong> JPG, PNG, WEBP or GIF.
                Maximum file size is 5MB per image. Replacing an image updates
                its existing gallery slot.
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================
            FAQ LIST
        ================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* SEARCH BAR */}
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-slate-800">
                All Frequently Asked Questions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredFAQs.length} questions found
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search FAQs..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* FAQ CONTENT */}
          <div className="p-5">
            {loading ? (
              <div className="flex min-h-60 flex-col items-center justify-center gap-3 text-slate-500">
                <Loader2 size={30} className="animate-spin text-emerald-600" />
                <p className="text-sm">Loading FAQs...</p>
              </div>
            ) : filteredFAQs.length === 0 ? (
              <div className="flex min-h-60 flex-col items-center justify-center text-center">
                <div className="mb-3 rounded-full bg-slate-100 p-4 text-slate-400">
                  <HelpCircle size={30} />
                </div>

                <h3 className="font-semibold text-slate-700">No FAQs found</h3>

                <p className="mt-1 text-sm text-slate-500">
                  {search
                    ? "Try another search term."
                    : "Start by adding your first FAQ."}
                </p>

                {!search && (
                  <button
                    onClick={handleAdd}
                    className="mt-4 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    + Add your first FAQ
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFAQs.map((faq, index) => (
                  <div
                    key={faq._id}
                    className="rounded-xl border border-slate-200 p-4 transition hover:border-emerald-200 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      {/* FAQ CONTENT */}
                      <div className="flex min-w-0 flex-1 gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-sm font-bold text-emerald-700">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold leading-6 text-slate-800">
                            {faq.question}
                          </h3>

                          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-500">
                            {faq.answer}
                          </p>

                          <div className="mt-3">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                                faq.isVisible
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  faq.isVisible
                                    ? "bg-emerald-500"
                                    : "bg-amber-500"
                                }`}
                              />

                              {faq.isVisible ? "Published" : "Hidden"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* FAQ ACTIONS */}
                      <div className="flex shrink-0 items-center gap-2 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
                        <button
                          onClick={() => handleToggleVisibility(faq)}
                          title={faq.isVisible ? "Hide FAQ" : "Publish FAQ"}
                          className="rounded-lg border border-slate-200 p-2.5 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          {faq.isVisible ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>

                        <button
                          onClick={() => handleEdit(faq)}
                          title="Edit FAQ"
                          className="rounded-lg border border-slate-200 p-2.5 text-blue-600 transition hover:border-blue-200 hover:bg-blue-50"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(faq._id)}
                          title="Delete FAQ"
                          className="rounded-lg border border-slate-200 p-2.5 text-red-500 transition hover:border-red-200 hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==================================================
          ADD / EDIT FAQ MODAL
      ================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {editingFAQ ? "Edit FAQ" : "Add New FAQ"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingFAQ
                    ? "Update the question and answer."
                    : "Create a new scholarship FAQ."}
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={21} />
              </button>
            </div>

            {/* MODAL FORM */}
            <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Question
                </label>

                <input
                  type="text"
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
                  placeholder="Enter your question..."
                  maxLength={300}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Answer
                </label>

                <textarea
                  name="answer"
                  value={formData.answer}
                  onChange={handleChange}
                  placeholder="Write the answer..."
                  rows={6}
                  maxLength={3000}
                  required
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />

                <p className="mt-1 text-right text-xs text-slate-400">
                  {formData.answer.length}/3000 characters
                </p>
              </div>

              {/* MODAL ACTIONS */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && <Loader2 size={17} className="animate-spin" />}

                  {saving ? "Saving..." : editingFAQ ? "Update FAQ" : "Add FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================
          IMAGE PREVIEW MODAL
      ================================================== */}

      {previewImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-white">{previewImage.title}</h3>

              <button
                onClick={() => setPreviewImage(null)}
                className="rounded-lg bg-white/10 p-2 text-white transition hover:bg-white/20"
                title="Close preview"
              >
                <X size={22} />
              </button>
            </div>

            <div className="overflow-hidden rounded-xl bg-black">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-h-[75vh] w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQsManagement;
