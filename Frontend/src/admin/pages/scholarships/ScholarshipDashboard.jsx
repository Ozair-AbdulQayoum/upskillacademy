import React from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Image,
  MessageSquare,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";

const managementSections = [
  {
    title: "Hero Section",
    description: "Manage headings, paragraphs, banner content, and images.",
    icon: Image,
    color: "blue",
    link: "/admin/scholarships/hero",
    button: "Manage Hero Section",
  },
  {
    title: "FAQs Management",
    description:
      "Add, edit, delete, and publish scholarship questions and answers.",
    icon: MessageSquare,
    color: "purple",
    link: "/admin/scholarships/faqs",
    button: "Manage FAQs",
  },
  {
    title: "FAQ Gallery",
    description:
      "Upload, replace, delete, and control the visibility of gallery images.",
    icon: Image,
    color: "emerald",
    link: "/admin/scholarships/faqs",
    button: "Manage Gallery",
  },
];

const colorStyles = {
  blue: {
    icon: "bg-blue-50 text-blue-600",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  purple: {
    icon: "bg-purple-50 text-purple-600",
    button: "bg-purple-600 hover:bg-purple-700",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    button: "bg-emerald-600 hover:bg-emerald-700",
  },
};

export default function ScholarshipDashboard() {
  return (
    <div className="min-h-screen space-y-8 bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* PAGE HEADER */}
      <div>
        <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
          <LayoutDashboard size={16} />
          <span>Admin Dashboard</span>
          <span>/</span>
          <span className="text-gray-900">Scholarships</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Scholarships Dashboard
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Manage and update all sections of your website's scholarship page.
        </p>
      </div>

      {/* MAIN DASHBOARD CARD */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
        {/* CARD HEADER */}
        <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <Award size={30} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Scholarship Page Management
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select a section below to manage its content.
            </p>
          </div>
        </div>

        {/* MANAGEMENT SECTIONS */}
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {managementSections.map((section) => {
            const Icon = section.icon;
            const styles = colorStyles[section.color];

            return (
              <div
                key={section.title}
                className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg"
              >
                {/* ICON */}
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${styles.icon}`}
                >
                  <Icon size={25} />
                </div>

                {/* CONTENT */}
                <h3 className="text-base font-semibold text-gray-900">
                  {section.title}
                </h3>

                <p className="mt-2 min-h-[48px] text-sm leading-6 text-gray-500">
                  {section.description}
                </p>

                {/* BUTTON */}
                <Link
                  to={section.link}
                  className={`mt-6 inline-flex w-fit items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition ${styles.button}`}
                >
                  {section.button}
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
