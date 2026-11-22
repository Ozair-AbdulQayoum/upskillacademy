import React, { useState } from "react";

export default function ApplicationForm() {
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const inputStyle =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition duration-300 placeholder:text-gray-400 focus:border-[#009FF6] focus:ring-2 focus:ring-[#009FF6]/10";

  const labelStyle = "mb-2 block text-sm font-semibold text-gray-800";

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const formData = new FormData(e.target);
      const applicationData = Object.fromEntries(formData.entries());

      const response = await fetch(`${API_BASE}/scholarship/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit your application.");
      }

      setMessage(
        "Your scholarship application has been submitted successfully!",
      );
      setMessageType("success");

      e.target.reset();
    } catch (error) {
      console.error("Scholarship Application Error:", error);

      setMessage(error.message || "Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-gray-50 py-14 sm:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        {/* FORM HEADER */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Scholarship Application Form
          </h1>

          <p className="mt-4 text-sm text-gray-500 sm:text-base">
            Please fill in all required fields marked with *
          </p>
        </div>

        {/* APPLICATION FORM */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8 lg:p-10"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* NAME */}
            <div>
              <label className={labelStyle}>
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                className={inputStyle}
                required
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className={labelStyle}>
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className={inputStyle}
                required
              />
            </div>

            {/* GENDER */}
            <div>
              <label className={labelStyle}>
                Gender <span className="text-red-500">*</span>
              </label>

              <div className="flex h-12 items-center gap-6 rounded-xl border border-gray-200 px-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    className="accent-[#009FF6]"
                    required
                  />
                  Male
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    className="accent-[#009FF6]"
                  />
                  Female
                </label>
              </div>
            </div>

            {/* PHONE NUMBER */}
            <div>
              <label className={labelStyle}>
                Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+93 7X XXX XXXX"
                className={inputStyle}
                required
              />
            </div>

            {/* WHATSAPP */}
            <div>
              <label className={labelStyle}>
                WhatsApp Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="whatsapp"
                placeholder="+93 7X XXX XXXX"
                className={inputStyle}
                required
              />
            </div>

            {/* CITY */}
            <div>
              <label className={labelStyle}>
                Your Current City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                placeholder="Enter your city"
                className={inputStyle}
                required
              />
            </div>

            {/* DESIRED PROGRAM */}
            <div className="sm:col-span-2">
              <label className={labelStyle}>Choose Your Desired Program</label>

              <select name="program" defaultValue="" className={inputStyle}>
                <option value="" disabled>
                  Select a program
                </option>
                <option value="Web Development">Web Development</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Data Science">Data Science</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* PREVIOUS EXPERIENCE */}
            <div className="sm:col-span-2">
              <label className={labelStyle}>
                Do you have previous experience in this field?{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center gap-8">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                  <input
                    type="radio"
                    name="experience"
                    value="Yes"
                    className="accent-[#009FF6]"
                    required
                  />
                  Yes
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                  <input
                    type="radio"
                    name="experience"
                    value="No"
                    className="accent-[#009FF6]"
                  />
                  No
                </label>
              </div>
            </div>

            {/* WHY SCHOLARSHIP */}
            <div className="sm:col-span-2">
              <label className={labelStyle}>
                Why do you want this scholarship? (Short Answer){" "}
                <span className="text-red-500">*</span>
              </label>

              <textarea
                name="scholarshipReason"
                rows="4"
                placeholder="Tell us why you want to receive this scholarship..."
                className={`${inputStyle} resize-none`}
                required
              />
            </div>

            {/* CAREER GOAL */}
            <div className="sm:col-span-2">
              <label className={labelStyle}>
                What is your career goal? (Short Answer){" "}
                <span className="text-red-500">*</span>
              </label>

              <textarea
                name="careerGoal"
                rows="4"
                placeholder="Describe your future career goals..."
                className={`${inputStyle} resize-none`}
                required
              />
            </div>

            {/* HOW DID YOU HEAR ABOUT US */}
            <div className="sm:col-span-2">
              <label className={labelStyle}>
                How Did You Hear About Us{" "}
                <span className="text-red-500">*</span>
              </label>

              <select
                name="source"
                defaultValue=""
                className={inputStyle}
                required
              >
                <option value="" disabled>
                  Select one
                </option>
                <option value="Upskill">Upskill</option>
                <option value="Social Media">Social Media</option>
                <option value="Friends and Family">Friends and Family</option>
                <option value="TV">TV</option>
                <option value="Flyer and Poster">Flyer and Poster</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* SUCCESS / ERROR MESSAGE */}
          {message && (
            <div
              role="alert"
              className={`mt-6 rounded-xl p-4 text-sm font-medium ${
                messageType === "success"
                  ? "border border-green-200 bg-green-50 text-green-700"
                  : "border border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#009FF6] px-6 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto sm:min-w-56"
            >
              {loading ? "Submitting..." : "Submit Registration"}
              {!loading && <span className="text-xl">→</span>}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
