import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Img1 from "../../Imgs/Scholarships Page Imgs/Img-1.webp";
import Img2 from "../../Imgs/Scholarships Page Imgs/Img-2.webp";
import Img3 from "../../Imgs/Scholarships Page Imgs/Img-3.webp";
import Img4 from "../../Imgs/Scholarships Page Imgs/Img-4.webp";
import Img5 from "../../Imgs/Scholarships Page Imgs/Img-5.webp";
import Img6 from "../../Imgs/Scholarships Page Imgs/Img-6.webp";
import Img7 from "../../Imgs/Scholarships Page Imgs/Img-7.webp";
import Img8 from "../../Imgs/Scholarships Page Imgs/Img-8.webp";

// Backend API URL
const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

const SERVER_BASE = API_BASE.replace(/\/api$/, "");

const defaultHero = {
  heading: "Upskill Digital Skills Scholarships",
  paragraph1:
    "Unlock your potential with Upskill Scholarships! Gain access to practical digital skills training, expert mentorship, and clear career pathways.",
  paragraph2:
    "Our scholarships empower learners to develop real-world skills in web development, graphic design, digital marketing, and more. Apply now to start your journey toward a successful career.",
  buttonText: "Apply Now",
  buttonLink: "/ApplicationForm",
  bannerTitle: "Upskill Scholarships – Learn, Grow, Succeed",
  videoLink: "https://www.upskillacademy.tech/scholarship-applications",
  images: {},
  isVisible: true,
};

const fallbackImages = [Img1, Img2, Img3, Img4, Img5, Img6, Img7, Img8];

const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${SERVER_BASE}${image}`;
};

export default function Hero() {
  const [hero, setHero] = useState(defaultHero);

  useEffect(() => {
    const fetchScholarshipHero = async () => {
      try {
        const response = await fetch(`${API_BASE}/scholarship/hero`);

        if (!response.ok) {
          throw new Error("Failed to fetch scholarship hero.");
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
        console.error("Scholarship Hero Error:", error);
      }
    };

    fetchScholarshipHero();
  }, []);

  // Hide section when disabled from admin
  if (!hero.isVisible) return null;

  const studentImages = [3, 4, 5];
  const galleryImages = [6, 7, 8];

  const getHeroImage = (imageNumber) => {
    const uploadedImage = hero.images?.[`image${imageNumber}`];

    return uploadedImage
      ? getImageUrl(uploadedImage)
      : fallbackImages[imageNumber - 1];
  };

  const isExternalLink = /^https?:\/\//i.test(hero.buttonLink || "");

  return (
    <section className="w-full bg-white pt-28 pb-14 sm:pt-32 sm:pb-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* LEFT CONTENT */}
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              {hero.heading}
            </h1>

            <p className="mt-6 text-base leading-8 text-gray-600 sm:text-lg">
              {hero.paragraph1}
            </p>

            <p className="mt-4 text-base leading-8 text-gray-600 sm:text-lg">
              {hero.paragraph2}
            </p>

            {isExternalLink ? (
              <a
                href={hero.buttonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-3 rounded-xl bg-[#009FF6] px-7 py-4 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:shadow-xl"
              >
                {hero.buttonText}
                <span className="text-xl">→</span>
              </a>
            ) : (
              <Link
                to={hero.buttonLink || "/ApplicationForm"}
                className="mt-8 inline-flex items-center gap-3 rounded-xl bg-[#009FF6] px-7 py-4 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:shadow-xl"
              >
                {hero.buttonText}
                <span className="text-xl">→</span>
              </Link>
            )}
          </div>

          {/* RIGHT CONTENT */}
          <div className="w-full">
            {/* TOP TWO IMAGES */}
            <div className="grid grid-cols-2 items-stretch gap-4">
              {[1, 2].map((number) => (
                <div
                  key={number}
                  className="h-52 overflow-hidden rounded-2xl sm:h-72"
                >
                  <img
                    src={getHeroImage(number)}
                    alt="Upskill scholarship student"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              ))}
            </div>

            {/* SCHOLARSHIP BANNER */}
            <div className="mt-5 rounded-2xl bg-[#EAF6FF] p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 flex-col items-start gap-3">
                  <h2 className="text-sm font-bold leading-relaxed text-gray-900 sm:text-base">
                    {hero.bannerTitle}
                  </h2>

                  <a
                    href={hero.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#009FF6] transition hover:text-blue-700 sm:text-sm"
                  >
                    Watch video ›
                  </a>
                </div>

                {/* STUDENT IMAGES */}
                <div className="flex shrink-0 items-center -space-x-3">
                  {studentImages.map((number, index) => (
                    <img
                      key={number}
                      src={getHeroImage(number)}
                      alt={`Scholarship student ${index + 1}`}
                      className="h-9 w-9 rounded-full border-[3px] border-white object-cover shadow-sm sm:h-11 sm:w-11"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* GALLERY IMAGES */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {galleryImages.map((number, index) => (
                <div key={number} className="overflow-hidden rounded-xl">
                  <img
                    src={getHeroImage(number)}
                    alt={`Scholarship gallery ${index + 1}`}
                    className="h-24 w-full object-cover transition-transform duration-500 hover:scale-110 sm:h-32"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
