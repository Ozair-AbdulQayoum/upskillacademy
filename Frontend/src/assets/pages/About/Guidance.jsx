import React, { useState, useEffect } from "react";

import Guidance1 from "../../Imgs/About Page Imgs/Guidance-img-1.jpg";
import Guidance2 from "../../Imgs/About Page Imgs/Guidance-img-2.jpg";
import Guidance3 from "../../Imgs/About Page Imgs/Guidance-img-3.jpg";
import Guidance4 from "../../Imgs/About Page Imgs/Guidance-img-4.jpg";
import Guidance5 from "../../Imgs/About Page Imgs/Guidance-img-5.jpg";

import api from "../../../services/api";

// Local fallback images
const expertImages = [Guidance1, Guidance2, Guidance3, Guidance4, Guidance5];

export default function Guidance() {
  const [guidance, setGuidance] = useState({
    title: "",
    description: "",
    experts: [],
  });

  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  // =====================================
  // FETCH GUIDANCE DATA
  // =====================================
  useEffect(() => {
    const fetchGuidance = async () => {
      try {
        const response = await api.get("/about/guidance");

        if (response.data.success && response.data.data) {
          setGuidance({
            title: response.data.data.title || "",
            description: response.data.data.description || "",
            experts: response.data.data.experts || [],
          });
        }
      } catch (error) {
        console.error("Failed to fetch Guidance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuidance();
  }, []);

  // =====================================
  // RESPONSIVE VISIBLE CARD COUNT
  // =====================================
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    updateVisibleCount();

    window.addEventListener("resize", updateVisibleCount);

    return () => {
      window.removeEventListener("resize", updateVisibleCount);
    };
  }, []);

  // =====================================
  // EXPERT DATA WITH DYNAMIC IMAGES
  // =====================================
  const experts = guidance.experts.map((expert, index) => ({
    ...expert,
    image: expert.image || expertImages[index % expertImages.length],
  }));

  // =====================================
  // CAROUSEL NAVIGATION
  // =====================================
  const maxIndex = Math.max(0, experts.length - visibleCount);

  // Keep index valid when data or screen size changes
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // =====================================
  // AUTO SLIDE EVERY 5 SECONDS
  // =====================================
  useEffect(() => {
    if (experts.length <= visibleCount) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [maxIndex, experts.length, visibleCount]);

  // =====================================
  // LOADING STATE
  // =====================================
  if (loading) {
    return (
      <section className="w-full bg-white py-20 px-5 md:px-10 lg:px-16">
        <div className="max-w-[1200px] mx-auto text-center text-gray-500">
          Loading Guidance...
        </div>
      </section>
    );
  }

  // =====================================
  // MAIN UI
  // =====================================
  return (
    <section className="w-full bg-white py-20 px-5 md:px-10 lg:px-16 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        {/* SECTION HEADING */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#101828] leading-tight mb-5">
            {guidance.title}
          </h2>

          <p className="text-gray-600 text-base md:text-lg leading-8">
            {guidance.description}
          </p>
        </div>

        {/* CAROUSEL */}
        <div className="relative overflow-hidden">
          <div
            className="flex gap-5 transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(calc(-${currentIndex} * (100% / ${visibleCount} + ${(20 * (visibleCount - 1)) / visibleCount}px)))`,
            }}
          >
            {experts.map((expert, index) => (
              <div
                key={expert._id || index}
                className="relative shrink-0 w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] h-[420px] md:h-[460px] rounded-2xl overflow-hidden group"
              >
                {/* EXPERT IMAGE */}
                <img
                  src={expert.image}
                  alt={expert.name || "Guidance expert"}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      expertImages[index % expertImages.length];
                  }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* DARK GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* EXPERT DETAILS */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-7">
                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">
                    {expert.name}
                  </h3>

                  <p className="text-sm text-gray-200 leading-6 line-clamp-4">
                    {expert.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NAVIGATION */}
        {experts.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            {/* PREVIOUS BUTTON */}
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous expert"
              disabled={maxIndex === 0}
              className="w-12 h-12 rounded-full bg-white border border-gray-200 text-[#009FF6] flex items-center justify-center hover:border-[#009FF6] hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            {/* NEXT BUTTON */}
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next expert"
              disabled={maxIndex === 0}
              className="w-12 h-12 rounded-full bg-[#009FF6] text-white flex items-center justify-center hover:bg-[#0086D1] hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
