import React, { useEffect, useState } from "react";
import Img from "../../../assets/Imgs/About Page Imgs/Hero-Img.jpg";
import api from "../../../services/api";

export default function Hero() {
  const [hero, setHero] = useState({
    subtitle: "About Upskill",
    title: "Our Story",
    backgroundImage: "",
    imageAlt: "About Upskill",
  });

  const [loading, setLoading] = useState(true);

  // Fetch Hero Content from Backend
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await api.get("/about/hero");

        if (response.data.success && response.data.data) {
          setHero((prev) => ({
            ...prev,
            ...response.data.data,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch About Hero:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);

  // Dynamic background image with fallback
  const heroImage = hero.backgroundImage || Img;

  return (
    <section className="relative top-0 m-0 p-0 w-full h-[500px] md:h-[650px] overflow-hidden">
      {/* Dynamic Background Image */}
      <img
        src={heroImage}
        alt={hero.imageAlt || "About Upskill"}
        className="absolute top-0 left-0 w-full h-full object-cover object-top"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = Img;
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/45"></div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-5 pt-24">
        <span className="text-sm md:text-base font-semibold tracking-[3px] uppercase text-white/90 mb-4">
          {hero.subtitle}
        </span>

        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
          {hero.title}
        </h1>
      </div>
    </section>
  );
}
