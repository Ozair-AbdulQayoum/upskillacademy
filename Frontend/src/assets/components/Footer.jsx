import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import qrCode from "../../assets/Imgs/Connect-icon.png";
import api from "../../services/api";

export default function Footer() {
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const response = await api.get("/site-settings/footer");

        if (response.data.success && response.data.data) {
          setFooter(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch Footer:", error);
      }
    };

    fetchFooter();
  }, []);

  // Default links
  const defaultServices = [
    { name: "Tech Services", path: "/services" },
    { name: "Online Courses", path: "/courses" },
    { name: "Scholarship", path: "/scholarship-applications" },
    { name: "Careers", path: "/careers" },
    { name: "Hire Talent", path: "/student-projects" },
    { name: "For Employers", path: "/employers" },
    { name: "Partners", path: "/partners" },
    { name: "Corporate Training", path: "/corporate-training" },
  ];

  const defaultHelpful = [
    { name: "About Us", path: "/about" },
    { name: "Our Instructors", path: "/about" },
    { name: "Success Stories", path: "/testimonials" },
    { name: "Blog", path: "/blog" },
    { name: "FAQ", path: "/faq" },
    { name: "Learning Paths", path: "/learning-paths" },
    { name: "Internships", path: "/internships-in-afghanistan" },
    { name: "Our Impact", path: "/impact" },
    { name: "Our Graduates", path: "/graduates" },
  ];

  const defaultInformation = [
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms of Service", path: "/terms-of-service" },
    { name: "Contact Us", path: "/contact" },
  ];

  const defaultSocialLinks = [
    { name: "Facebook", url: "https://facebook.com/" },
    { name: "Instagram", url: "https://instagram.com/" },
    { name: "LinkedIn", url: "https://linkedin.com/" },
  ];

  const defaultBottomLinks = [
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms of Service", path: "/terms-of-service" },
  ];

  // Safely read footer columns
  const columns = Array.isArray(footer?.columns) ? footer.columns : [];

  // Find columns using their titles
  const findColumn = (...keywords) =>
    columns.find((column) =>
      keywords.some((keyword) =>
        column?.title?.toLowerCase().includes(keyword.toLowerCase()),
      ),
    );

  const servicesColumn = findColumn("service");
  const helpfulColumn = findColumn("helpful", "useful");
  const informationColumn = findColumn("information", "support");

  // Use database links if available, otherwise defaults
  const getLinks = (column, fallback) =>
    Array.isArray(column?.links) && column.links.length > 0
      ? column.links
      : fallback;

  const servicesLinks = getLinks(servicesColumn, defaultServices);
  const helpfulLinks = getLinks(helpfulColumn, defaultHelpful);
  const informationLinks = getLinks(informationColumn, defaultInformation);

  const socialLinks =
    Array.isArray(footer?.socialLinks) && footer.socialLinks.length > 0
      ? footer.socialLinks
      : defaultSocialLinks;

  const bottomLinks =
    Array.isArray(footer?.bottomLinks) && footer.bottomLinks.length > 0
      ? footer.bottomLinks
      : defaultBottomLinks;

  // Sort and filter links
  const prepareLinks = (links) =>
    [...links]
      .filter((link) => link && link.isVisible !== false)
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  // Social icons
  const socialIcons = {
    Facebook: (
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    ),
    Instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="18" cy="6" r="0.5" fill="currentColor" />
      </>
    ),
    LinkedIn: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  };

  // Reusable footer links
  const LinkList = ({ title, links }) => (
    <div>
      <h3 className="text-[#101828] text-lg font-semibold mb-6">{title}</h3>

      <ul className="space-y-3">
        {prepareLinks(links).map((link, index) => (
          <li key={link._id || `${link.name}-${index}`}>
            <Link
              to={link.path || "#"}
              className="text-gray-500 text-sm hover:text-[#009FF6] transition-colors duration-300"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="w-full bg-white text-[#101828]">
      {/* Main Footer */}
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-16 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">
          {/* Brand and Social Media */}
          <div>
            <h2 className="text-2xl font-bold text-[#101828] mb-5">
              {footer?.brandName || "Upskill"}
              <span className="text-[#009FF6]">.</span>
            </h2>

            <p className="text-gray-500 text-sm leading-7 mb-3">
              {footer?.description ||
                "Empowering Afghan Youth with Skills for a Digital Future"}
            </p>

            <p className="text-[#101828] text-sm font-semibold mb-7">
              — {footer?.poweredByText || "Powered by Upskill"}
            </p>

            {/* Social Media */}
            <div className="flex items-center gap-3 mb-8">
              {socialLinks
                .filter((social) => social.isVisible !== false)
                .map((social, index) => (
                  <a
                    key={social._id || `${social.name}-${index}`}
                    href={social.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    title={social.name}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#009FF6] hover:border-[#009FF6] hover:text-white transition-all duration-300"
                  >
                    {socialIcons[social.name] && (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {socialIcons[social.name]}
                      </svg>
                    )}
                  </a>
                ))}
            </div>

            {/* QR Code */}
            <div>
              <h3 className="text-[#101828] text-base font-semibold mb-3">
                Let's Connect
              </h3>

              <img
                src={qrCode}
                alt="Upskill Academy Connect QR Code"
                className="w-28 h-28 object-contain rounded-lg border border-gray-100 p-2"
              />
            </div>
          </div>

          {/* Services */}
          <LinkList
            title={servicesColumn?.title || "Services"}
            links={servicesLinks}
          />

          {/* Helpful Links */}
          <LinkList
            title={helpfulColumn?.title || "Helpful Links"}
            links={helpfulLinks}
          />

          {/* Information */}
          <div>
            <h3 className="text-[#101828] text-lg font-semibold mb-6">
              {informationColumn?.title || "Information"}
            </h3>

            <ul className="space-y-3 mb-8">
              {prepareLinks(informationLinks).map((link, index) => (
                <li key={link._id || `${link.name}-${index}`}>
                  <Link
                    to={link.path || "#"}
                    className="text-gray-500 text-sm hover:text-[#009FF6] transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Location */}
            <div className="flex items-start gap-3 mb-5">
              <svg
                className="text-[#009FF6] shrink-0 mt-1"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>

              <span className="text-gray-500 text-sm">
                {footer?.location || "Kabul, Afghanistan"}
              </span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <svg
                className="text-[#009FF6] shrink-0"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.35 1.84.58 2.8.7a2 2 0 0 1 1.73 2.03Z" />
              </svg>

              <a
                href={footer?.phoneLink || "tel:+93781765151"}
                className="text-gray-500 text-sm font-semibold hover:text-[#009FF6] transition-colors"
              >
                {footer?.phone || "+93 78 176 5151"}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-16 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs text-center md:text-left">
              {footer?.copyrightText ||
                "© 2026 Upskill Academy. All rights reserved."}
            </p>

            <div className="flex items-center gap-5">
              {prepareLinks(bottomLinks).map((link, index) => (
                <Link
                  key={link._id || `${link.name}-${index}`}
                  to={link.path || "#"}
                  className="text-gray-500 text-xs hover:text-[#009FF6] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <p className="text-gray-500 text-xs">
              Powered by{" "}
              <span className="text-[#101828] font-semibold">Upskill</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
