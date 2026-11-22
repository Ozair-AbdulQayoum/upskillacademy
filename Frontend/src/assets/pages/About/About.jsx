import React, { useEffect, useState } from "react";
import api from "../../../services/api";

import img1 from "../../Imgs/About Page Imgs/About-img-1.jpg";
import img2 from "../../Imgs/About Page Imgs/About-img-2.jpg";

// =====================================
// DEFAULT CONTENT
// =====================================
const defaultAbout = {
  badge: "About",
  title: "Unveiling Our Vision and Mission",
  description:
    "Explore our vision and mission, as we connect local talent with global opportunities through free, practical learning.",

  images: {
    first: "",
    second: "",
  },

  socialLinks: [
    { name: "Facebook", url: "#" },
    { name: "Instagram", url: "#" },
    { name: "LinkedIn", url: "#" },
    { name: "Email", url: "mailto:info@upskillacademy.af" },
  ],

  statistics: {
    students: {
      value: 1350,
      title: "Students",
      description: "Learners growing with our community in Kabul and online.",
    },
    teamMembers: {
      value: 7,
      title: "Team Members",
      description:
        "Our dedicated mentors and instructors guiding every learner.",
    },
    freeLearning: {
      value: 100,
      suffix: "%",
      title: "Free Learning",
      description:
        "Every course is free, so talent — not money — decides who gets to learn.",
    },
    mission: {
      value: 1,
      title: "Mission",
      description:
        "United by one goal: empower youth with digital skills for real impact.",
    },
    courses: {
      value: 7,
      title: "Courses",
      description: "Practical tracks in code, design and digital skills.",
    },
  },
};

// =====================================
// ANIMATED COUNTER
// =====================================
function Counter({ target = 0, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);

  const numericTarget = Math.max(0, Number(target) || 0);

  useEffect(() => {
    let startTime;
    let animation;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(easeOut * numericTarget));

      if (progress < 1) {
        animation = requestAnimationFrame(animate);
      } else {
        setCount(numericTarget);
      }
    };

    animation = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animation);
  }, [numericTarget, duration]);

  return (
    <>
      {count.toLocaleString()}
      {suffix}
    </>
  );
}

// =====================================
// MAIN ABOUT COMPONENT
// =====================================
export default function About() {
  const [about, setAbout] = useState(defaultAbout);
  const [loading, setLoading] = useState(true);

  // =====================================
  // FETCH ABOUT SECTION
  // =====================================
  useEffect(() => {
    const fetchAboutSection = async () => {
      try {
        const response = await api.get("/about/section");

        if (response.data.success && response.data.data) {
          const data = response.data.data;

          setAbout((prev) => ({
            ...prev,
            ...data,

            images: {
              ...prev.images,
              ...(data.images || {}),
            },

            socialLinks: data.socialLinks ?? prev.socialLinks,

            statistics: {
              ...prev.statistics,
              ...(data.statistics || {}),

              students: {
                ...prev.statistics.students,
                ...(data.statistics?.students || {}),
              },

              teamMembers: {
                ...prev.statistics.teamMembers,
                ...(data.statistics?.teamMembers || {}),
              },

              freeLearning: {
                ...prev.statistics.freeLearning,
                ...(data.statistics?.freeLearning || {}),
              },

              mission: {
                ...prev.statistics.mission,
                ...(data.statistics?.mission || {}),
              },

              courses: {
                ...prev.statistics.courses,
                ...(data.statistics?.courses || {}),
              },
            },
          }));
        }
      } catch (error) {
        console.error("Failed to fetch About Section:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutSection();
  }, []);

  // =====================================
  // DYNAMIC DATA
  // =====================================
  const stats = about.statistics;

  const firstImage = about.images?.first || img1;
  const secondImage = about.images?.second || img2;

  const getSocialUrl = (name, fallback = "#") =>
    about.socialLinks?.find(
      (link) => link.name?.toLowerCase() === name.toLowerCase(),
    )?.url || fallback;

  // =====================================
  // LOADING STATE
  // =====================================
  if (loading) {
    return (
      <section className="w-full min-h-screen bg-[#F3F9FE] flex items-center justify-center">
        <p className="text-gray-500">Loading About Section...</p>
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen bg-[#F3F9FE] px-5 py-16 md:px-12 lg:px-20">
      {/* SECTION HEADING */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <span className="inline-block bg-[#079BF4] text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          {about.badge}
        </span>

        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#101828]">
          {about.title}
        </h2>

        <p className="text-gray-500 text-base leading-7 mt-4 max-w-lg mx-auto">
          {about.description}
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-[1150px] mx-auto grid grid-cols-1 md:grid-cols-[2.06fr_1fr_1fr] md:grid-rows-[220px_180px_180px] gap-4">
        {/* FIRST DYNAMIC IMAGE */}
        <div className="overflow-hidden rounded-2xl min-h-[230px] md:min-h-0">
          <img
            src={firstImage}
            alt="Upskill Academy students learning"
            loading="lazy"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* LEFT BOTTOM CARDS */}
        <div className="grid grid-cols-2 grid-rows-2 gap-3 md:col-start-1 md:row-start-2 md:row-span-2">
          {/* SOCIAL MEDIA */}
          <div className="grid grid-cols-2 grid-rows-2 gap-3">
            <a
              href={getSocialUrl("Facebook")}
              aria-label="Facebook"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center bg-[#079BF4] text-white rounded-xl text-2xl font-bold hover:bg-blue-600 transition"
            >
              f
            </a>

            <a
              href={getSocialUrl("Instagram")}
              aria-label="Instagram"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="18" cy="6" r="1" fill="currentColor" />
              </svg>
            </a>

            <a
              href={getSocialUrl("LinkedIn")}
              aria-label="LinkedIn"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center bg-white border border-gray-100 rounded-xl font-bold text-xl hover:bg-gray-50 transition"
            >
              in
            </a>

            <a
              href={getSocialUrl("Email", "mailto:info@upskillacademy.af")}
              aria-label="Email"
              className="flex items-center justify-center bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 5h18v14H3V5zm9 8L4.5 7h15L12 13z" />
              </svg>
            </a>
          </div>

          {/* STUDENTS CARD */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col justify-center">
            <h3 className="text-3xl font-semibold text-[#101828]">
              <Counter target={stats.students.value} />
            </h3>

            <div className="mt-4">
              <h4 className="text-base font-semibold text-[#101828]">
                {stats.students.title}
              </h4>

              <p className="text-sm text-gray-500 leading-6 mt-2">
                {stats.students.description}
              </p>
            </div>
          </div>

          {/* TEAM MEMBERS CARD */}
          <div className="bg-[#08A9EE] text-white rounded-2xl p-5 flex flex-col justify-between row-span-2">
            <h3 className="text-5xl font-semibold">
              <Counter target={stats.teamMembers.value} />
            </h3>

            <div>
              <h4 className="text-base font-semibold">
                {stats.teamMembers.title}
              </h4>

              <p className="text-sm leading-6 mt-2">
                {stats.teamMembers.description}
              </p>
            </div>
          </div>
        </div>

        {/* FREE LEARNING CARD */}
        <div className="bg-[#111827] text-white rounded-2xl p-6 md:col-start-2 md:row-start-1 md:row-span-2 flex flex-col justify-between min-h-[300px] md:min-h-0">
          <h3 className="text-4xl md:text-5xl font-semibold">
            <Counter
              target={stats.freeLearning.value}
              suffix={stats.freeLearning.suffix}
            />
          </h3>

          <div>
            <h4 className="text-base font-semibold">
              {stats.freeLearning.title}
            </h4>

            <p className="text-sm text-gray-300 leading-6 mt-3">
              {stats.freeLearning.description}
            </p>
          </div>
        </div>

        {/* MISSION CARD */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 md:col-start-3 md:row-start-1 flex flex-col justify-between min-h-[180px]">
          <h3 className="text-3xl font-semibold">
            <Counter target={stats.mission.value} />
          </h3>

          <div>
            <h4 className="text-base font-semibold">{stats.mission.title}</h4>

            <p className="text-sm text-gray-500 leading-6 mt-2">
              {stats.mission.description}
            </p>
          </div>
        </div>

        {/* COURSES CARD */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 md:col-start-3 md:row-start-2 flex flex-col justify-between min-h-[180px]">
          <h3 className="text-3xl font-semibold">
            <Counter target={stats.courses.value} />
          </h3>

          <div>
            <h4 className="text-base font-semibold">{stats.courses.title}</h4>

            <p className="text-sm text-gray-500 leading-6 mt-2">
              {stats.courses.description}
            </p>
          </div>
        </div>

        {/* SECOND DYNAMIC IMAGE */}
        <div className="overflow-hidden rounded-2xl min-h-[230px] md:min-h-0 md:col-start-2 md:col-span-2 md:row-start-3">
          <img
            src={secondImage}
            alt="Upskill Academy team members"
            loading="lazy"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </section>
  );
}
