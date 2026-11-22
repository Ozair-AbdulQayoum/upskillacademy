import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// ==================================================
// API CONFIGURATION
// ==================================================

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ==================================================
// DEFAULT CTA DATA
// ==================================================

const defaultCTA = {
  heading: "Have an internship or job to fill?",
  description:
    "Tell us about the role and we'll send you a short list of students who could do it.",
  buttonText: "Contact our team",
  buttonLink: "/contact",
  isVisible: true,
};

// ==================================================
// CTA COMPONENT
// ==================================================

export default function CTA() {
  const [cta, setCTA] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==================================================
  // FETCH CTA CONTENT
  // ==================================================

  useEffect(() => {
    const fetchCTA = async () => {
      try {
        const response = await fetch(`${API_BASE}/employers/cta`);

        if (!response.ok) {
          throw new Error("Failed to fetch CTA content.");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Unable to load CTA.");
        }

        const section = result.cta || result.data?.cta || result.data;

        if (!section || typeof section !== "object") {
          throw new Error("Invalid CTA response.");
        }

        setCTA({
          ...defaultCTA,
          ...section,
        });
      } catch (error) {
        console.error("CTA Fetch Error:", error);
        setCTA(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCTA();
  }, []);

  // ==================================================
  // LOADING STATE
  // ==================================================

  if (loading) {
    return null;
  }

  // ==================================================
  // VISIBILITY CONTROL
  // ==================================================

  if (!cta || !cta.isVisible) {
    return null;
  }

  // ==================================================
  // BUTTON LINK
  // ==================================================

  const buttonLink = cta.buttonLink || "/contact";

  const isExternalLink = /^https?:\/\//i.test(buttonLink);

  // ==================================================
  // BUTTON CONTENT
  // ==================================================

  const buttonContent = (
    <>
      {cta.buttonText}
      <span className="text-xl">→</span>
    </>
  );

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-8 rounded-3xl bg-[#009FF6] px-7 py-12 shadow-lg shadow-blue-500/20 sm:px-12 sm:py-14 lg:flex-row lg:px-16">
          {/* LEFT CONTENT */}

          <div className="max-w-2xl text-center lg:text-left">
            <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              {cta.heading}
            </h2>

            <p className="mt-4 text-base leading-8 text-white/90 sm:text-lg">
              {cta.description}
            </p>
          </div>

          {/* RIGHT BUTTON */}

          <div className="shrink-0">
            {isExternalLink ? (
              <a
                href={buttonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-white px-7 py-4 font-semibold text-[#009FF6] shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-xl"
              >
                {buttonContent}
              </a>
            ) : (
              <Link
                to={buttonLink}
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-white px-7 py-4 font-semibold text-[#009FF6] shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-xl"
              >
                {buttonContent}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
