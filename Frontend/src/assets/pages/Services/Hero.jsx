import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/services/hero";

const defaultHero = {
  badge: "Upskill Tech Services",
  headingPart1: "Empowering Businesses",
  headingPart2: "Inspiring Innovation",
  description:
    "To empower businesses with cutting-edge technology solutions, unlocking their growth potential by connecting them with passionate and skilled engineers.",
};

export default function Hero() {
  const [hero, setHero] = useState(defaultHero);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await axios.get(API_URL, {
          timeout: 8000,
        });

        if (response.data?.success && response.data?.data) {
          setHero({
            ...defaultHero,
            ...response.data.data,
          });
        }
      } catch (error) {
        console.error("Public Services Hero Error:", error);
        // Keep default content if the API is unavailable.
      }
    };

    fetchHero();
  }, []);

  return (
    <section className="w-full bg-white px-5 py-20 md:py-28">
      <div className="max-w-5xl mx-auto text-center">
        {/* Small Label */}
        <span className="inline-block px-4 py-2 mb-6 rounded-full bg-[#009FF6]/10 text-[#009FF6] text-sm font-semibold">
          {hero.badge}
        </span>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          <span className="text-[#009FF6]">{hero.headingPart1}</span>{" "}
          <span className="text-gray-900">{hero.headingPart2}</span>
        </h1>

        {/* Description */}
        <p className="max-w-3xl mx-auto text-gray-500 text-base md:text-lg leading-relaxed">
          {hero.description}
        </p>
      </div>
    </section>
  );
}
