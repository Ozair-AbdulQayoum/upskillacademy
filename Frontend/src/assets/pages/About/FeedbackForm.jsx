import React, { useEffect, useState } from "react";
import api from "../../../services/api";

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // =====================================
  // FETCH FEEDBACK SECTION CONTENT
  // =====================================
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await api.get("/about/feedback");

        if (response.data.success && response.data.data) {
          setFeedback(response.data.data);
        } else {
          setErrorMessage("Unable to load contact information.");
        }
      } catch (error) {
        console.error("Failed to fetch feedback section:", error);
        setErrorMessage("Unable to load contact information.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // =====================================
  // HANDLE INPUT CHANGES
  // =====================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  };

  // =====================================
  // SUBMIT FEEDBACK
  // =====================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await api.post("/about/feedback/submit", formData);

      setSuccessMessage(
        response.data.message || "Thank you! Your message has been submitted.",
      );

      setFormData({
        fullName: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Feedback submission failed:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================
  // DYNAMIC SVG ICONS
  // =====================================
  const renderIcon = (icon) => {
    switch (icon) {
      case "location":
        return (
          <>
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
          </>
        );

      case "email":
        return (
          <>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </>
        );

      case "phone":
        return (
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.35 1.84.58 2.8.7a2 2 0 0 1 1.73 2.03Z" />
        );

      default:
        return null;
    }
  };

  // =====================================
  // LOADING STATE
  // =====================================
  if (loading) {
    return (
      <section className="w-full bg-white py-20 px-5 md:px-10 lg:px-16">
        <div className="max-w-[1200px] mx-auto text-center text-gray-500">
          Loading contact information...
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-20 px-5 md:px-10 lg:px-16">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* =====================================
              LEFT SECTION
          ===================================== */}
          <div className="flex flex-col justify-center">
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-[#101828] mb-5">
                {feedback?.title || "Get in Touch"}
              </h2>

              <p className="text-gray-500 text-base md:text-lg leading-8 max-w-lg">
                {feedback?.description || ""}
              </p>
            </div>

            {/* CONTACT INFORMATION */}
            <div className="space-y-8">
              {(feedback?.contactItems || []).map((item, index) => (
                <div key={item._id || index} className="flex items-start gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-[#EAF6FF] text-[#009FF6] flex items-center justify-center">
                    <svg
                      width="23"
                      height="23"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {renderIcon(item.icon)}
                    </svg>
                  </div>

                  <div>
                    <h4 className="text-base font-semibold text-[#101828] mb-2">
                      {item.label}
                    </h4>

                    <a
                      href={item.href || "#"}
                      target={item.icon === "location" ? "_blank" : undefined}
                      rel={item.icon === "location" ? "noreferrer" : undefined}
                      className="text-gray-600 text-sm md:text-base leading-7 hover:text-[#009FF6] transition-colors break-words"
                    >
                      {item.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =====================================
              RIGHT SECTION: CONTACT FORM
          ===================================== */}
          <div className="bg-white rounded-3xl p-7 md:p-10 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-semibold text-[#101828] mb-2">
              {feedback?.formTitle || "Send Us a Message"}
            </h3>

            <p className="text-gray-500 text-sm mb-8">
              {feedback?.formDescription || ""}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* FULL NAME */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-[#101828] mb-2"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  maxLength={100}
                  required
                  className="w-full px-4 py-4 rounded-xl border border-gray-200 bg-[#F9FBFD] text-gray-800 outline-none focus:border-[#009FF6] focus:ring-2 focus:ring-[#009FF6]/10 transition-all"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-[#101828] mb-2"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  maxLength={254}
                  required
                  className="w-full px-4 py-4 rounded-xl border border-gray-200 bg-[#F9FBFD] text-gray-800 outline-none focus:border-[#009FF6] focus:ring-2 focus:ring-[#009FF6]/10 transition-all"
                />
              </div>

              {/* MESSAGE */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-[#101828] mb-2"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  rows="5"
                  maxLength={5000}
                  required
                  className="w-full px-4 py-4 rounded-xl border border-gray-200 bg-[#F9FBFD] text-gray-800 outline-none focus:border-[#009FF6] focus:ring-2 focus:ring-[#009FF6]/10 transition-all resize-none"
                />
              </div>

              {/* SUCCESS MESSAGE */}
              {successMessage && (
                <div
                  role="status"
                  className="p-3 rounded-lg bg-green-50 text-green-700 text-sm"
                >
                  {successMessage}
                </div>
              )}

              {/* ERROR MESSAGE */}
              {errorMessage && (
                <div
                  role="alert"
                  className="p-3 rounded-lg bg-red-50 text-red-600 text-sm"
                >
                  {errorMessage}
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-9 py-4 rounded-xl bg-[#009FF6] text-white font-semibold flex items-center justify-center gap-3 hover:bg-[#0086D1] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending..." : "Send Message"}

                {!submitting && (
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
