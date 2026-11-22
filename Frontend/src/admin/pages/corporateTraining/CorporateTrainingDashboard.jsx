import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Image,
  ListChecks,
  ArrowUpRight,
  Eye,
  Settings2,
} from "lucide-react";

const managementCards = [
  {
    title: "Hero Section",
    description: "Manage the main heading, description, CTA and hero images.",
    path: "/admin/corporate-training/hero",
    icon: Image,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Topics Section",
    description: "Manage training topics, icons, steps and section image.",
    path: "/admin/corporate-training/topics",
    icon: ListChecks,
    color: "bg-purple-100 text-purple-600",
  },
];

export default function CorporateTrainingDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* HEADER */}

      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <Building2 size={17} />
            <span>Admin / Corporate Training</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Corporate Training Overview
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage and customize your Corporate Training page content.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.open("/corporate-training", "_blank")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#009FF6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          <Eye size={18} />
          View Website
          <ArrowUpRight size={16} />
        </button>
      </div>

      {/* SUMMARY CARD */}

      <div className="mb-8 rounded-2xl bg-[#101828] p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-300">PAGE MANAGEMENT</p>

            <h2 className="mt-2 text-2xl font-bold">Corporate Training</h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-300">
              Manage your corporate training content, showcase available
              training topics and keep your website information up to date.
            </p>
          </div>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10">
            <Building2 size={34} className="text-blue-400" />
          </div>
        </div>
      </div>

      {/* SECTION MANAGEMENT */}

      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">
          Manage Page Sections
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Select a section to manage its content.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {managementCards.map((card) => {
          const Icon = card.icon;

          return (
            <button
              key={card.path}
              type="button"
              onClick={() => navigate(card.path)}
              className="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
                >
                  <Icon size={24} />
                </div>

                <ArrowUpRight
                  size={20}
                  className="text-gray-400 transition group-hover:text-[#009FF6]"
                />
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                {card.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {card.description}
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#009FF6]">
                Manage Section
                <ArrowUpRight size={16} />
              </span>
            </button>
          );
        })}
      </div>

      {/* QUICK INFORMATION */}

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <Settings2 size={21} className="text-gray-500" />

          <h2 className="font-bold text-gray-900">Content Management</h2>
        </div>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Changes made in the management sections are saved to your database and
          displayed on the public Corporate Training page.
        </p>
      </div>
    </div>
  );
}
