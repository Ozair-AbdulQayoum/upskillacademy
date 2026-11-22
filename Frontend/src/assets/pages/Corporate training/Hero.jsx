import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";

import img1 from "../../Imgs/Corporate training Page Imgs/Img-1.webp";
import img2 from "../../Imgs/Corporate training Page Imgs/Img-2.webp";
import img3 from "../../Imgs/Corporate training Page Imgs/Img-3.webp";

// API CONFIGURATION
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SERVER_URL = API_BASE.replace(/\/api\/?$/, "");

// DEFAULT CONTENT
const defaultHero = {
  label: "For teams",
  heading: "Corporate training",
  highlightedHeading: "Skills your staff can use.",
  description:
    "Practical digital skills training for your staff, planned around your work.",
  buttonText: "Request a training plan",
  buttonLink: "/contact",
  image1: "",
  image2: "",
  image3: "",
  isVisible: true,
};

// IMAGE URL HANDLER
const getImageUrl = (image, fallback) => {
  if (!image) return fallback;

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${SERVER_URL}${image.startsWith("/") ? "" : "/"}${image}`;
};

export default function Hero() {
  const [hero, setHero] = useState(defaultHero);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await fetch(`${API_BASE}/corporate-training/hero`);

        if (!response.ok) {
          throw new Error("Failed to fetch Corporate Training Hero");
        }

        const result = await response.json();

        if (result.success && result.hero) {
          setHero({
            ...defaultHero,
            ...result.hero,
          });
        }
      } catch (error) {
        console.error("Corporate Training Hero Error:", error);
      }
    };

    fetchHero();
  }, []);

  // Hide section if disabled from admin panel
  if (!hero.isVisible) return null;

  const buttonLink = hero.buttonLink || "/contact";

  const buttonClass =
    "inline-flex items-center justify-center gap-3 rounded-xl bg-[#009FF6] px-7 py-4 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:shadow-xl";

  const buttonContent = (
    <>
      {hero.buttonText}
      <span className="text-xl">→</span>
    </>
  );

  return (
    <section className="w-full bg-white pt-28 pb-16 sm:pt-32 sm:pb-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* LEFT SIDE - CONTENT */}
          <div className="max-w-xl">
            {/* LABEL */}
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-[#009FF6]">
              <Building2 size={18} strokeWidth={2} />
              {hero.label}
            </div>

            {/* HEADING */}
            <h1 className="mt-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              {hero.heading}

              <span className="block text-[#009FF6]">
                {hero.highlightedHeading}
              </span>
            </h1>

            {/* DESCRIPTION */}
            <p className="mt-6 max-w-lg text-base leading-8 text-gray-600 sm:text-lg">
              {hero.description}
            </p>

            {/* CTA BUTTON */}
            <div className="mt-8">
              {buttonLink.startsWith("http://") ||
              buttonLink.startsWith("https://") ? (
                <a
                  href={buttonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass}
                >
                  {buttonContent}
                </a>
              ) : (
                <Link to={buttonLink} className={buttonClass}>
                  {buttonContent}
                </Link>
              )}
            </div>
          </div>

          {/* RIGHT SIDE - IMAGES */}
          <div className="w-full space-y-4">
            {/* TOP TWO IMAGES */}
            <div className="grid grid-cols-2 gap-4">
              <div className="h-52 overflow-hidden rounded-2xl sm:h-64">
                <img
                  src={getImageUrl(hero.image1, img1)}
                  alt="Corporate digital skills training"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div className="h-52 overflow-hidden rounded-2xl sm:h-64">
                <img
                  src={getImageUrl(hero.image2, img2)}
                  alt="Professional team training"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>

            {/* BOTTOM IMAGE */}
            <div className="h-56 overflow-hidden rounded-2xl sm:h-64">
              <img
                src={getImageUrl(hero.image3, img3)}
                alt="Corporate learning and development"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
