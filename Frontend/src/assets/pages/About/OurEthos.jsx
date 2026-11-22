import { useEffect, useState } from "react";

import img1 from "../../Imgs/About Page Imgs/Mission-img-1.jpg";
import img2 from "../../Imgs/About Page Imgs/Mission-img-2.jpg";
import img3 from "../../Imgs/About Page Imgs/Mission-img-3.jpg";

import api from "../../../services/api";

// =====================================
// DEFAULT IMAGES
// =====================================
const defaultImages = [img1, img2, img3];

// =====================================
// FEATURE ICONS
// =====================================
function FeatureIcon({ type }) {
  const icons = {
    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
        <path d="M4 5.5v16M8 7h8M8 11h8" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0-18" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    lightbulb: (
      <>
        <path d="M9 18h6M10 22h4M8.5 14.5a7 7 0 1 1 7 0c-.9.7-1.5 1.7-1.5 3h-4c0-1.3-.6-2.3-1.5-3Z" />
      </>
    ),
  };

  return (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[type] || icons.book}
    </svg>
  );
}

// =====================================
// MAIN COMPONENT
// =====================================
export default function OurEthos() {
  const [ethos, setEthos] = useState({
    valuesBadge: "",
    valuesTitle: "",
    valuesParagraphs: [],
    missionBadge: "",
    missionTitle: "",
    missionDescription: "",
    features: [],
    images: [],
  });

  const [loading, setLoading] = useState(true);

  // =====================================
  // FETCH OUR ETHOS FROM BACKEND
  // =====================================
  useEffect(() => {
    const fetchEthos = async () => {
      try {
        const response = await api.get("/about/ethos");

        if (response.data.success && response.data.data) {
          setEthos((prev) => ({
            ...prev,
            ...response.data.data,
            valuesParagraphs: response.data.data.valuesParagraphs || [],
            features: response.data.data.features || [],
            images: response.data.data.images || [],
          }));
        }
      } catch (error) {
        console.error("Failed to fetch Our Ethos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEthos();
  }, []);

  // =====================================
  // DYNAMIC IMAGES WITH FALLBACK
  // =====================================
  const images = ethos.images.length > 0 ? ethos.images : defaultImages;

  // =====================================
  // LOADING STATE
  // =====================================
  if (loading) {
    return (
      <section className="w-full bg-white py-20 px-5 md:px-10 lg:px-16">
        <div className="max-w-[1200px] mx-auto text-center text-gray-500">
          Loading Our Ethos...
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-20 px-5 md:px-10 lg:px-16">
      <div className="max-w-[1200px] mx-auto">
        {/* =====================================
            OUR VALUES
        ===================================== */}
        <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.7fr] gap-8 md:gap-16 mb-20">
          {/* Left Side */}
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-[#079BF4] mb-4">
              <span className="w-7 h-[2px] bg-[#079BF4]" />
              {ethos.valuesBadge}
            </span>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight text-[#101828]">
              {ethos.valuesTitle}
            </h2>
          </div>

          {/* Right Side */}
          <div>
            {ethos.valuesParagraphs.map((paragraph, index) => (
              <p
                key={index}
                className={`text-gray-600 text-base md:text-lg leading-8 ${
                  index !== ethos.valuesParagraphs.length - 1 ? "mb-5" : ""
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* =====================================
            OUR MISSION
        ===================================== */}
        <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.7fr] gap-8 md:gap-16 mb-16">
          {/* Left Side */}
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-[#079BF4] mb-4">
              <span className="w-7 h-[2px] bg-[#079BF4]" />
              {ethos.missionBadge}
            </span>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight text-[#101828]">
              {ethos.missionTitle}
            </h2>
          </div>

          {/* Right Side */}
          <div>
            <p className="text-gray-600 text-base md:text-lg leading-8">
              {ethos.missionDescription}
            </p>

            {/* FEATURE CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-9">
              {ethos.features.map((feature, index) => (
                <div
                  key={feature._id || index}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-[#F3F9FE] border border-gray-100 hover:border-[#079BF4]/40 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-[#079BF4] text-white flex items-center justify-center">
                    <FeatureIcon type={feature.icon} />
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-[#101828] mb-2">
                      {feature.title}
                    </h3>

                    <p className="text-sm text-gray-500 leading-6">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =====================================
            DYNAMIC IMAGES
        ===================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {images.map((image, index) => (
            <div
              key={index}
              className="h-[240px] md:h-[280px] overflow-hidden rounded-2xl group"
            >
              <img
                src={image}
                alt={`Upskill Academy mission ${index + 1}`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
