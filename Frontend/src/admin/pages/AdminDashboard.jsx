import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Info,
  BriefcaseBusiness,
  GraduationCap,
  Building2,
  Users,
  ArrowUpRight,
  LayoutDashboard,
  Globe,
  Settings,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  PanelsTopLeft,
  MousePointerClick,
  Image as ImageIcon,
} from "lucide-react";

// ==================================================
// WEBSITE MANAGEMENT PAGES
// ==================================================

const pages = [
  {
    title: "About Page",
    subtitle: "Organization Information",
    description:
      "Manage your organization's story, gallery, mission, values, guidance and visitor feedback.",
    path: "/admin/about",
    number: "01",
    modules: "8 Management Modules",
    icon: Info,
    color: "blue",
  },
  {
    title: "Services Page",
    subtitle: "Services & Programs",
    description:
      "Manage your services, programs, technology information, clients and organizational values.",
    path: "/admin/services",
    number: "02",
    modules: "6 Management Modules",
    icon: BriefcaseBusiness,
    color: "violet",
  },
  {
    title: "Scholarships Page",
    subtitle: "Scholarship Opportunities",
    description:
      "Manage scholarship information, page content, frequently asked questions and applications.",
    path: "/admin/scholarships",
    number: "03",
    modules: "4 Management Modules",
    icon: GraduationCap,
    color: "emerald",
  },
  {
    title: "Employers Page",
    subtitle: "Employer Partnerships",
    description:
      "Manage employer information, the working process, promotional content and calls to action.",
    path: "/admin/employers",
    number: "04",
    modules: "3 Management Modules",
    icon: Building2,
    color: "orange",
  },
  {
    title: "Corporate Training",
    subtitle: "Professional Development",
    description:
      "Manage corporate training information, hero content, topics and training-related images.",
    path: "/admin/corporate-training",
    number: "05",
    modules: "2 Management Modules",
    icon: Users,
    color: "cyan",
  },
];

// ==================================================
// CARD COLOR STYLES
// ==================================================

const colorStyles = {
  blue: {
    icon: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    label: "text-blue-600 bg-blue-50",
    border: "group-hover:border-blue-200",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white",
    label: "text-violet-600 bg-violet-50",
    border: "group-hover:border-violet-200",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
    label: "text-emerald-600 bg-emerald-50",
    border: "group-hover:border-emerald-200",
  },
  orange: {
    icon: "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white",
    label: "text-orange-600 bg-orange-50",
    border: "group-hover:border-orange-200",
  },
  cyan: {
    icon: "bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white",
    label: "text-cyan-600 bg-cyan-50",
    border: "group-hover:border-cyan-200",
  },
};

// ==================================================
// OVERVIEW DATA
// ==================================================

const overview = [
  {
    title: "Website Pages",
    value: "05",
    description: "Main website sections",
    icon: Globe,
    iconStyle: "bg-blue-50 text-blue-600",
  },
  {
    title: "CMS Modules",
    value: "23",
    description: "Configured management modules",
    icon: PanelsTopLeft,
    iconStyle: "bg-violet-50 text-violet-600",
  },
  {
    title: "Admin Workspace",
    value: "Active",
    description: "Content management workspace",
    icon: ShieldCheck,
    iconStyle: "bg-emerald-50 text-emerald-600",
  },
];

// ==================================================
// MAIN ADMIN DASHBOARD
// ==================================================

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-[1500px] space-y-8 pb-10">
      {/* PAGE HEADER */}
      <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-gray-400">
            <LayoutDashboard size={15} />
            <span>Admin Panel</span>
            <ChevronRight size={13} />
            <span className="text-[#009FF6]">Main Dashboard</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#101828] md:text-3xl">
            Dashboard Overview
          </h1>

          <p className="mt-2 text-sm text-gray-500 md:text-base">
            Welcome to your centralized website content management workspace.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-[#009FF6] hover:text-[#009FF6] hover:shadow-md"
        >
          <Globe size={17} />
          View Website
          <ExternalLink size={15} />
        </a>
      </header>

      {/* WELCOME BANNER */}
      <section className="relative overflow-hidden rounded-2xl bg-[#101828] shadow-sm">
        <div className="absolute -right-20 -top-36 h-96 w-96 rounded-full border-[45px] border-white/[0.04]" />
        <div className="absolute -bottom-44 right-36 h-80 w-80 rounded-full bg-[#009FF6]/10 blur-3xl" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-white/[0.03]" />

        <div className="relative z-10 flex flex-col gap-8 p-6 md:p-9 lg:flex-row lg:items-center lg:justify-between lg:p-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#55C3FF]">
                Upskill CMS Workspace
              </span>
            </div>

            <h2 className="mt-5 text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl">
              Everything in one place.
              <span className="block text-[#55C3FF]">
                Your website, your control.
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-300 md:text-base">
              Manage and maintain your website through one centralized
              workspace. Select a page, update its content and keep your digital
              presence organized.
            </p>

            <button
              type="button"
              onClick={() => navigate("/admin/about")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#009FF6] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#009FF6]/20 transition-all hover:bg-[#0088D5]"
            >
              Explore Management
              <ArrowUpRight size={17} />
            </button>
          </div>

          {/* BANNER VISUAL */}
          <div className="hidden shrink-0 items-center justify-center lg:flex">
            <div className="relative flex h-48 w-48 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04]">
              <div className="absolute inset-4 rounded-2xl border border-white/10" />

              <LayoutDashboard
                size={90}
                strokeWidth={1.1}
                className="text-[#55C3FF]"
              />

              <div className="absolute -right-5 top-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#009FF6] shadow-lg">
                <Settings size={22} className="text-white" />
              </div>

              <div className="absolute -bottom-6 -left-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 shadow-lg">
                <CheckCircle2 size={22} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKSPACE OVERVIEW */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-[#101828]">
            Workspace Overview
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Your website management at a glance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {overview.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {item.title}
                    </p>

                    <h3 className="mt-3 text-2xl font-bold text-[#101828] md:text-3xl">
                      {item.value}
                    </h3>
                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconStyle}`}
                  >
                    <Icon size={22} />
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-400">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* WEBSITE MANAGEMENT */}
      <section>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#101828]">
              Website Management
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select one of the five main pages to manage its content.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600">
            <Globe size={14} className="text-[#009FF6]" />
            05 Main Pages
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {pages.map((page) => {
            const Icon = page.icon;
            const styles = colorStyles[page.color];

            return (
              <button
                key={page.path}
                type="button"
                onClick={() => navigate(page.path)}
                className={`group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#009FF6] focus:ring-offset-2 md:p-6 ${styles.border}`}
              >
                {/* CARD TOP */}
                <div className="mb-6 flex items-center justify-between">
                  <div
                    className={`flex h-[52px] w-[52px] items-center justify-center rounded-xl transition-all duration-300 ${styles.icon}`}
                  >
                    <Icon size={24} strokeWidth={1.8} />
                  </div>

                  <span className="text-xs font-bold tracking-widest text-gray-300">
                    {page.number}
                  </span>
                </div>

                {/* CARD CONTENT */}
                <div>
                  <span
                    className={`inline-flex rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${styles.label}`}
                  >
                    {page.subtitle}
                  </span>

                  <h3 className="mt-3 text-lg font-bold text-[#101828] transition-colors group-hover:text-[#009FF6]">
                    {page.title}
                  </h3>

                  <p className="mt-2 min-h-[72px] text-sm leading-6 text-gray-500">
                    {page.description}
                  </p>
                </div>

                {/* CARD FOOTER */}
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-xs font-semibold text-[#344054]">
                      Manage Page
                    </p>
                    <p className="mt-1 text-[11px] text-gray-400">
                      {page.modules}
                    </p>
                  </div>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-all duration-300 group-hover:bg-[#009FF6] group-hover:text-white">
                    <ArrowUpRight size={19} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* QUICK ACCESS */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF6FF] text-[#009FF6]">
            <MousePointerClick size={20} />
          </div>

          <div>
            <h2 className="text-base font-bold text-[#101828]">Quick Access</h2>
            <p className="mt-1 text-xs text-gray-500">
              Frequently used management areas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button
            type="button"
            onClick={() => navigate("/admin/about/hero")}
            className="flex items-center justify-between gap-3 rounded-xl border border-transparent bg-gray-50 p-4 text-left transition-all hover:border-blue-200 hover:bg-blue-50/50"
          >
            <div className="flex items-center gap-3">
              <ImageIcon size={19} className="text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">
                About Hero
              </span>
            </div>
            <ArrowUpRight size={16} className="text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/services")}
            className="flex items-center justify-between gap-3 rounded-xl border border-transparent bg-gray-50 p-4 text-left transition-all hover:border-violet-200 hover:bg-violet-50/50"
          >
            <div className="flex items-center gap-3">
              <BriefcaseBusiness size={19} className="text-violet-600" />
              <span className="text-sm font-semibold text-gray-700">
                Services Overview
              </span>
            </div>
            <ArrowUpRight size={16} className="text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/scholarships/applications")}
            className="flex items-center justify-between gap-3 rounded-xl border border-transparent bg-gray-50 p-4 text-left transition-all hover:border-emerald-200 hover:bg-emerald-50/50"
          >
            <div className="flex items-center gap-3">
              <GraduationCap size={19} className="text-emerald-600" />
              <span className="text-sm font-semibold text-gray-700">
                Scholarship Applications
              </span>
            </div>
            <ArrowUpRight size={16} className="text-gray-400" />
          </button>
        </div>
      </section>

      {/* FOOTER INFORMATION */}
      <footer className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#101828]">
              Centralized Content Management
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Your five main website pages are organized in one workspace.
            </p>
          </div>
        </div>

        <span className="text-xs font-medium text-gray-400">
          Upskill Administration
        </span>
      </footer>
    </div>
  );
}
