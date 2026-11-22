import React, { useEffect, useState } from "react";

import {
  Search,
  Send,
  CalendarCheck,
  BriefcaseBusiness,
  FolderCheck,
  BadgeCheck,
} from "lucide-react";

import img1 from "../../Imgs/Employers Page Imgs/Img-4.webp";

// ==================================================
// API CONFIGURATION
// ==================================================

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const SERVER_BASE = API_BASE.replace(/\/api\/?$/, "");

// ==================================================
// ICON CONFIGURATION
// ==================================================

const iconMap = {
  Search,
  Send,
  CalendarCheck,
  BriefcaseBusiness,
  FolderCheck,
  BadgeCheck,
};

const getIcon = (iconName, fallback = BriefcaseBusiness) => {
  return iconMap[iconName] || fallback;
};

// ==================================================
// IMAGE URL HELPER
// ==================================================

const getImageUrl = (image) => {
  if (!image) return img1;

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  return `${SERVER_BASE}/${image.replace(/^\/+/, "")}`;
};

// ==================================================
// MAIN COMPONENT
// ==================================================

export default function Howitworks() {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==================================================
  // FETCH DATA FROM BACKEND
  // ==================================================

  useEffect(() => {
    const fetchHowItWorks = async () => {
      try {
        const response = await fetch(`${API_BASE}/employers/how-it-works`);

        if (!response.ok) {
          throw new Error("Failed to fetch How It Works content.");
        }

        const result = await response.json();

        const data =
          result.data?.howItWorks || result.data || result.howItWorks;

        if (!data) {
          throw new Error("How It Works data was not found.");
        }

        setSection(data);
      } catch (error) {
        console.error("How It Works API Error:", error);
        setSection(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHowItWorks();
  }, []);

  // ==================================================
  // LOADING STATE
  // ==================================================

  if (loading) {
    return null;
  }

  // ==================================================
  // HIDE SECTION IF DISABLED
  // ==================================================

  if (!section || section.isVisible === false) {
    return null;
  }

  // ==================================================
  // DYNAMIC CONTENT
  // ==================================================

  const {
    label,
    heading,
    steps = [],
    noFees = {},
    features = [],
    image,
  } = section;

  const sectionImage = getImageUrl(image);

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <section className="w-full bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* SECTION HEADER */}

        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-5 py-2 text-sm font-semibold text-[#009FF6]">
            {label}
          </span>

          <h2 className="mt-5 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
            {heading}
          </h2>
        </div>

        {/* THREE STEPS */}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = getIcon(step.icon, Search);

            return (
              <div
                key={step._id || step.number || index}
                className="group relative rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-bold text-blue-100 transition-colors duration-300 group-hover:text-[#009FF6]">
                    {step.number}
                  </span>

                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-[#009FF6] transition-all duration-300 group-hover:bg-[#009FF6] group-hover:text-white">
                    <Icon size={26} strokeWidth={1.8} />
                  </div>
                </div>

                <h3 className="mt-8 text-xl font-bold text-gray-900">
                  {step.title}
                </h3>

                <p className="mt-3 text-base leading-7 text-gray-600">
                  {step.description}
                </p>

                <div className="mt-7 h-1 w-12 rounded-full bg-[#009FF6] transition-all duration-300 group-hover:w-20" />
              </div>
            );
          })}
        </div>

        {/* ADDITIONAL INFORMATION */}

        <div className="mt-10 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          {/* NO FEES CARD */}

          <div className="flex flex-col justify-between overflow-hidden rounded-2xl bg-[#011340] p-8 text-white shadow-lg sm:p-10">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 text-[#009FF6]">
                {React.createElement(getIcon(noFees.icon, BriefcaseBusiness), {
                  size: 28,
                })}
              </div>

              <h3 className="mt-8 text-2xl font-bold leading-snug sm:text-3xl">
                {noFees.title}
              </h3>

              <p className="mt-5 max-w-md text-base leading-8 text-blue-100/80">
                {noFees.description}
              </p>
            </div>

            <div className="mt-10 h-1 w-16 rounded-full bg-[#009FF6]" />
          </div>

          {/* RIGHT SIDE */}

          <div className="flex flex-col gap-6">
            {/* DYNAMIC FEATURE CARDS */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {features.map((feature, index) => {
                const Icon = getIcon(
                  feature.icon,
                  index === 0 ? FolderCheck : BadgeCheck,
                );

                return (
                  <div
                    key={feature._id || index}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#009FF6]">
                      <Icon size={25} />
                    </div>

                    <h3 className="mt-6 text-lg font-bold text-gray-900">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* DYNAMIC IMAGE */}

            <div className="h-56 overflow-hidden rounded-2xl sm:h-64">
              <img
                src={sectionImage}
                alt="Upskill professional training and student projects"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                onError={(event) => {
                  event.currentTarget.src = img1;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
