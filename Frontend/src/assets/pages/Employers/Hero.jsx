import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import img1 from "../../Imgs/Employers Page Imgs/Img-1.webp";
import img2 from "../../Imgs/Employers Page Imgs/Img-2.webp";
import img3 from "../../Imgs/Employers Page Imgs/Img-3.webp";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SERVER_BASE = API_BASE.replace(/\/api\/?$/, "");

const defaultHero = {
  label: "For employers",
  heading: "Hire trained junior talent.",
  highlightedHeading: "See the work first.",
  description:
    "See real projects first, then ask us for an interview. There is no recruitment fee.",
  primaryButtonText: "Browse talent",
  primaryButtonLink: "/student-projects",
  secondaryButtonText: "Corporate training",
  secondaryButtonLink: "/corporate-training",
  images: {
    image1: "",
    image2: "",
    image3: "",
  },
  isVisible: true,
};

const fallbackImages = {
  image1: img1,
  image2: img2,
  image3: img3,
};

export default function Hero() {
  const [hero, setHero] = useState(defaultHero);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH EMPLOYERS HERO FROM BACKEND
  // ==========================================

  useEffect(() => {
    const controller = new AbortController();

    const fetchHero = async () => {
      try {
        const response = await fetch(`${API_BASE}/employers/hero`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Employers Hero.");
        }

        const data = await response.json();

        if (data.success && data.hero) {
          setHero({
            ...defaultHero,
            ...data.hero,
            images: {
              ...defaultHero.images,
              ...data.hero.images,
            },
          });
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Employers Hero Error:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchHero();

    return () => controller.abort();
  }, []);

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (imageKey) => {
    const imagePath = hero.images?.[imageKey];

    if (!imagePath) {
      return fallbackImages[imageKey];
    }

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    return `${SERVER_BASE}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <section className="w-full bg-white pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 animate-pulse">
            <div className="space-y-6">
              <div className="h-8 w-36 rounded-full bg-gray-200" />
              <div className="h-16 w-full rounded-lg bg-gray-200" />
              <div className="h-6 w-4/5 rounded bg-gray-200" />
              <div className="h-12 w-48 rounded-xl bg-gray-200" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="h-52 rounded-2xl bg-gray-200 sm:h-64" />
              <div className="h-52 rounded-2xl bg-gray-200 sm:h-64" />
              <div className="col-span-2 h-56 rounded-2xl bg-gray-200 sm:h-64" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================
  // VISIBILITY
  // ==========================================

  if (hero.isVisible === false) {
    return null;
  }

  // ==========================================
  // HERO UI
  // ==========================================

  return (
    <section className="w-full bg-white pt-28 pb-16 sm:pt-32 sm:pb-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* LEFT SIDE - CONTENT */}

          <div className="max-w-xl">
            {/* LABEL */}

            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-[#009FF6]">
              <span className="text-lg">✦</span>
              {hero.label}
            </div>

            {/* HEADING */}

            <h1 className="mt-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              {hero.heading}
              <span className="text-[#009FF6]"> {hero.highlightedHeading}</span>
            </h1>

            {/* DESCRIPTION */}

            <p className="mt-6 max-w-lg text-base leading-8 text-gray-600 sm:text-lg">
              {hero.description}
            </p>

            {/* BUTTONS */}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {hero.primaryButtonText && hero.primaryButtonLink && (
                <Link
                  to={hero.primaryButtonLink}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#009FF6] px-7 py-4 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:shadow-xl"
                >
                  {hero.primaryButtonText}
                  <span className="text-lg">→</span>
                </Link>
              )}

              {hero.secondaryButtonText && hero.secondaryButtonLink && (
                <Link
                  to={hero.secondaryButtonLink}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#009FF6] bg-white px-7 py-4 font-semibold text-[#009FF6] transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50"
                >
                  {hero.secondaryButtonText}
                  <span className="text-lg">→</span>
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
                  src={getImageUrl("image1")}
                  alt="Trained junior talent"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div className="h-52 overflow-hidden rounded-2xl sm:h-64">
                <img
                  src={getImageUrl("image2")}
                  alt="Professional training"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>

            {/* BOTTOM IMAGE */}

            <div className="h-56 overflow-hidden rounded-2xl sm:h-64">
              <img
                src={getImageUrl("image3")}
                alt="Students working on real projects"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
