import React from "react";
import { useLocation } from "react-router-dom";

import {
  Menu,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
} from "lucide-react";

// ==================================================
// PAGE CONFIGURATION
// ==================================================

const pageConfig = [
  {
    path: "/admin/about",
    title: "About Management",
    description: "Manage your website's about page content.",
    website: "/about",
    section: "About",
  },
  {
    path: "/admin/services",
    title: "Services Management",
    description: "Manage services, programs and website content.",
    website: "/services",
    section: "Services",
  },
  {
    path: "/admin/scholarships",
    title: "Scholarships Management",
    description: "Manage scholarship information and applications.",
    website: "/scholarships",
    section: "Scholarships",
  },
  {
    path: "/admin/employers",
    title: "Employers Management",
    description: "Manage employer-related website content.",
    website: "/employers",
    section: "Employers",
  },
  {
    path: "/admin/corporate-training",
    title: "Corporate Training Management",
    description: "Manage corporate training page content and sections.",
    website: "/corporate-training",
    section: "Corporate Training",
  },
  {
    path: "/admin/settings",
    title: "Website Settings",
    description: "Manage your website's global settings.",
    website: "/",
    section: "Settings",
  },
];

// ==================================================
// SUBPAGE CONFIGURATION
// ==================================================

const subPageTitles = {
  hero: "Hero Section",
  gallery: "Gallery Management",
  section: "About Section",
  ethos: "Our Ethos",
  guidance: "Guidance",
  faq: "FAQ Management",
  faqs: "FAQ Management",
  feedback: "Feedback Management",
  messages: "Messages",
  program: "Program Management",
  tech: "Technology Management",
  clients: "Clients Management",
  values: "Values Management",
  applications: "Applications",
  "how-it-works": "How It Works",
  cta: "CTA Management",
  topics: "Topics Section",
  navbar: "Navbar Management",
  footer: "Footer Management",
};

// ==================================================
// ADMIN HEADER
// ==================================================

export default function AdminHeader({ onToggle }) {
  const location = useLocation();
  const pathname = location.pathname;

  // Find current section
  const currentSection = pageConfig.find(
    (item) => pathname === item.path || pathname.startsWith(`${item.path}/`),
  );

  const section = currentSection || {
    title: "Admin Dashboard",
    description: "Manage your website from one place.",
    website: "/",
    section: "Dashboard",
  };

  // Get current subpage
  const lastSegment = pathname.split("/").filter(Boolean).pop();

  const isOverview = pathname === section.path || lastSegment === "admin";

  const pageTitle = isOverview
    ? section.title
    : subPageTitles[lastSegment] || section.title;

  const pageDescription = isOverview
    ? section.description
    : `Manage and update your ${pageTitle.toLowerCase()} content.`;

  // ==================================================
  // HEADER UI
  // ==================================================

  return (
    <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between border-b border-gray-200 bg-white/95 px-4 shadow-sm backdrop-blur-md sm:px-6 lg:px-8">
      {/* LEFT SIDE */}

      <div className="flex min-w-0 items-center gap-3 sm:gap-5">
        {/* MENU BUTTON */}

        <button
          type="button"
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-[#009FF6]"
        >
          <Menu size={21} />
        </button>

        {/* PAGE INFORMATION */}

        <div className="min-w-0">
          {/* BREADCRUMB */}

          <div className="mb-1 hidden items-center gap-2 text-xs text-gray-400 sm:flex">
            <LayoutDashboard size={13} />

            <span>Admin Panel</span>

            <ChevronRight size={13} />

            <span className="font-medium text-gray-500">{section.section}</span>

            {!isOverview && (
              <>
                <ChevronRight size={13} />

                <span className="truncate text-[#009FF6]">{pageTitle}</span>
              </>
            )}
          </div>

          {/* TITLE */}

          <h1 className="truncate text-base font-bold text-[#101828] sm:text-lg">
            {pageTitle}
          </h1>

          {/* DESCRIPTION */}

          <p className="hidden truncate text-xs text-gray-500 sm:block">
            {pageDescription}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div className="flex shrink-0 items-center gap-3 sm:gap-5">
        {/* VIEW WEBSITE */}

        <a
          href={section.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 transition-all hover:border-[#009FF6] hover:bg-blue-50 hover:text-[#009FF6] sm:px-4"
        >
          <span className="hidden sm:inline">View Website</span>
          <ExternalLink size={16} />
        </a>

        {/* DIVIDER */}

        <div className="hidden h-9 w-px bg-gray-200 sm:block" />

        {/* ADMIN PROFILE */}

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF6FF] text-[#009FF6]">
            <GraduationCap size={22} />
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-semibold text-[#101828]">
              Administrator
            </p>

            <p className="text-xs text-gray-500">Website Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}
