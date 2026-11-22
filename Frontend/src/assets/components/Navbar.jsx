import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/Imgs/Logo.png";
import MenuIcon from "../../assets/Imgs/Menu-icon.svg";
import api from "../../services/api";

export default function Navbar() {
  const [language, setLanguage] = useState("EN");
  const [menuOpen, setMenuOpen] = useState(false);
  const [navbar, setNavbar] = useState(null);

  const location = useLocation();

  // Fetch Navbar data from backend
  useEffect(() => {
    const fetchNavbar = async () => {
      try {
        const response = await api.get("/site-settings/navbar");

        if (response.data.success) {
          setNavbar(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch Navbar:", error.message);
      }
    };

    fetchNavbar();
  }, []);

  // Fallback navigation links
  const defaultLinks = [
    { name: "Home", path: "/", order: 1 },
    { name: "Courses", path: "/courses", order: 2 },
    { name: "Testimonials", path: "/testimonials", order: 3 },
    { name: "About", path: "/about", order: 4 },
    { name: "Partners", path: "/partners", order: 5 },
    { name: "Hire Talent", path: "/student-projects", order: 6 },
  ];

  const navLinks = (navbar?.navLinks || defaultLinks)
    .filter((link) => link.isVisible !== false)
    .sort((a, b) => a.order - b.order);

  const languages = (
    navbar?.languages || [
      { name: "English", code: "EN" },
      { name: "Dari", code: "دری" },
      { name: "Pashto", code: "پښتو" },
    ]
  ).filter((lang) => lang.isVisible !== false);

  const loginButton = navbar?.loginButton || {
    label: "Log in",
    path: "/login",
    isVisible: true,
  };

  const startLearningButton = navbar?.startLearningButton || {
    label: "Start Learning",
    path: "/register",
    isVisible: true,
  };

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) =>
    `text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
      isActive(path) ? "text-[#19A2F4]" : "text-gray-800 hover:text-[#19A2F4]"
    }`;

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-transparent px-4 pt-4">
      <nav className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md border border-white/40 shadow-md rounded-2xl px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[76px]">
          {/* Logo */}
          <Link to={navbar?.logo?.link || "/"} className="shrink-0">
            <img
              src={Logo}
              alt={navbar?.logo?.alt || "Upskill Academy"}
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link._id || link.path}
                to={link.path}
                className={linkStyle(link.path)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden xl:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full p-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-2 text-xs font-semibold rounded-full transition-all ${
                    language === lang.code
                      ? "bg-[#069BF4] text-white shadow-sm"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {lang.code}
                </button>
              ))}
            </div>

            {/* Login */}
            {loginButton.isVisible && (
              <Link
                to={loginButton.path}
                className="px-5 py-3 text-sm font-semibold text-black border border-gray-200 rounded-xl hover:bg-gray-100 transition"
              >
                {loginButton.label}
              </Link>
            )}

            {/* Start Learning */}
            {startLearningButton.isVisible && (
              <Link
                to={startLearningButton.path}
                className="px-5 py-3 text-sm font-semibold text-white bg-[#32ACF4] rounded-xl hover:bg-[#168ED8] transition"
              >
                {startLearningButton.label}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="xl:hidden p-2"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <img src={MenuIcon} alt="" className="w-7 h-7" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="xl:hidden pb-5 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link._id || link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`block font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? "text-[#19A2F4]"
                    : "text-gray-800 hover:text-[#19A2F4]"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Language Switcher */}
            <div className="flex w-fit items-center gap-1 bg-white border border-gray-200 rounded-full p-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-4 py-2 text-xs font-semibold rounded-full transition ${
                    language === lang.code
                      ? "bg-[#069BF4] text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {lang.code}
                </button>
              ))}
            </div>

            {/* Mobile Buttons */}
            <div className="flex gap-3">
              {loginButton.isVisible && (
                <Link
                  to={loginButton.path}
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center py-3 border border-gray-200 rounded-xl text-black font-semibold"
                >
                  {loginButton.label}
                </Link>
              )}

              {startLearningButton.isVisible && (
                <Link
                  to={startLearningButton.path}
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center py-3 bg-[#32ACF4] text-white rounded-xl font-semibold"
                >
                  {startLearningButton.label}
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
