import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Keyboard,
  Calculator,
  Palette,
  Globe,
  Monitor,
  Code,
  Database,
  FileText,
  Briefcase,
  ChartNoAxesCombined,
  Image as ImageIcon,
} from "lucide-react";

import img1 from "../../Imgs/Corporate training Page Imgs/Img-4.webp";

// ==============================
// API CONFIGURATION
// ==============================

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SERVER_URL = API_BASE.replace(/\/api\/?$/, "");

// ==============================
// ICON MAPPING
// ==============================

const iconMap = {
  Keyboard,
  Calculator,
  Palette,
  Globe,
  Monitor,
  Code,
  Database,
  FileText,
  Briefcase,
  ChartNoAxesCombined,
  Image: ImageIcon,
};

// ==============================
// DEFAULT CONTENT
// ==============================

const defaultTopics = {
  isVisible: true,

  sectionLabel: "Topics",
  sectionHeading: "Topics we can teach",

  topics: [
    { title: "Typing and office skills", icon: "Keyboard" },
    { title: "Accounting and QuickBooks", icon: "Calculator" },
    { title: "Graphic design", icon: "Palette" },
    { title: "Websites and WordPress", icon: "Globe" },
  ],

  howItWorksLabel: "How it works",
  howItWorksHeading: "Three simple steps",

  steps: [
    "Tell us about your team and what they need to learn.",
    "We propose a plan, schedule and price.",
    "We deliver the training online or in person.",
  ],

  buttonText: "Request a training plan",
  buttonLink: "/contact",
  image: "",
};

// ==============================
// IMAGE URL HANDLER
// ==============================

const getImageUrl = (image) => {
  if (!image) return img1;

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${SERVER_URL}${image.startsWith("/") ? "" : "/"}${image}`;
};

// ==============================
// MAIN COMPONENT
// ==============================

export default function Topics() {
  const [content, setContent] = useState(defaultTopics);

  // ==============================
  // FETCH TOPICS FROM API
  // ==============================

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(`${API_BASE}/corporate-training/topics`);

        if (!response.ok) {
          throw new Error("Failed to fetch Corporate Training Topics.");
        }

        const result = await response.json();

        if (result.success && result.topics) {
          setContent({
            ...defaultTopics,
            ...result.topics,
            topics: Array.isArray(result.topics.topics)
              ? result.topics.topics
              : defaultTopics.topics,
            steps: Array.isArray(result.topics.steps)
              ? result.topics.steps
              : defaultTopics.steps,
          });
        }
      } catch (error) {
        console.error("Corporate Training Topics Error:", error);
      }
    };

    fetchTopics();
  }, []);

  // ==============================
  // SECTION VISIBILITY
  // ==============================

  if (!content.isVisible) return null;

  // ==============================
  // CTA BUTTON
  // ==============================

  const buttonLink = content.buttonLink || "/contact";

  const buttonClass =
    "inline-flex items-center justify-center gap-3 rounded-xl bg-[#009FF6] px-7 py-4 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:shadow-xl";

  const buttonContent = (
    <>
      {content.buttonText}
      <span className="text-xl">→</span>
    </>
  );

  // ==============================
  // RENDER COMPONENT
  // ==============================

  return (
    <section className="w-full bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* SECTION HEADER */}
        <div className="mb-10 text-center">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-5 py-2 text-sm font-semibold text-[#009FF6]">
            {content.sectionLabel}
          </span>

          <h2 className="mt-5 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            {content.sectionHeading}
          </h2>
        </div>

        {/* TOPIC CARDS */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {content.topics.map((topic, index) => {
            const Icon = iconMap[topic.icon] || Globe;

            return (
              <div
                key={topic._id || index}
                className="group flex min-h-52 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#009FF6] transition-all duration-300 group-hover:bg-[#009FF6] group-hover:text-white">
                  <Icon size={30} strokeWidth={1.8} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-900">
                  {topic.title}
                </h3>
              </div>
            );
          })}
        </div>

        {/* HOW IT WORKS SECTION */}
        <div className="mt-16 grid grid-cols-1 items-stretch overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm lg:grid-cols-2">
          {/* LEFT SIDE - CONTENT */}
          <div className="flex flex-col justify-center bg-[#011340] p-7 text-white sm:p-10 lg:p-12">
            <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-[#009FF6]">
              {content.howItWorksLabel}
            </span>

            <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
              {content.howItWorksHeading}
            </h2>

            {/* STEPS */}
            <div className="mt-8 space-y-7">
              {content.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-base font-bold text-[#009FF6]">
                    {index + 1}
                  </div>

                  <p className="pt-1 text-base leading-7 text-gray-200">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA BUTTON */}
            <div className="mt-9">
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

          {/* RIGHT SIDE - IMAGE */}
          <div className="min-h-80 overflow-hidden lg:min-h-full">
            <img
              src={getImageUrl(content.image)}
              alt="Corporate training and professional skills development"
              className="h-full min-h-80 w-full object-cover transition-transform duration-500 hover:scale-105 lg:min-h-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
