import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Image,
  Images,
  Info,
  Target,
  Users,
  HelpCircle,
  MessageSquare,
  Inbox,
  ArrowUpRight,
  LayoutDashboard,
  Globe,
  CheckCircle2,
  ChevronRight,
  FileText,
} from "lucide-react";

const modules = [
  {
    title: "Hero Section",
    description: "Manage the main heading, description, CTA and hero images.",
    path: "/admin/about/hero",
    icon: Image,
    number: "01",
    category: "Page Content",
  },
  {
    title: "Gallery",
    description: "Upload, organize and manage your About page gallery.",
    path: "/admin/about/gallery",
    icon: Images,
    number: "02",
    category: "Media",
  },
  {
    title: "About Section",
    description: "Edit your organization story, statistics and social links.",
    path: "/admin/about/section",
    icon: Info,
    number: "03",
    category: "Page Content",
  },
  {
    title: "Our Ethos",
    description: "Manage your mission, vision, values and core principles.",
    path: "/admin/about/ethos",
    icon: Target,
    number: "04",
    category: "Organization",
  },
  {
    title: "Guidance",
    description: "Manage expert profiles and guidance information.",
    path: "/admin/about/guidance",
    icon: Users,
    number: "05",
    category: "Organization",
  },
  {
    title: "FAQ",
    description: "Create, update and organize frequently asked questions.",
    path: "/admin/about/faq",
    icon: HelpCircle,
    number: "06",
    category: "Page Content",
  },
  {
    title: "Feedback Form",
    description: "Manage feedback form content and contact information.",
    path: "/admin/about/feedback",
    icon: MessageSquare,
    number: "07",
    category: "Communication",
  },
  {
    title: "Messages",
    description: "View and manage messages submitted by website visitors.",
    path: "/admin/about/messages",
    icon: Inbox,
    number: "08",
    category: "Communication",
  },
];

const stats = [
  {
    label: "Management Modules",
    value: "08",
    description: "Available About page modules",
    icon: LayoutDashboard,
  },
  {
    label: "Content Categories",
    value: "04",
    description: "Organized content areas",
    icon: FileText,
  },
  {
    label: "Website Integration",
    value: "CMS",
    description: "Connected content management",
    icon: Globe,
  },
];

export default function AboutDashboard() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-sm mb-3">
            <span className="text-gray-400">Admin</span>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="font-semibold text-[#009FF6]">About Page</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#101828]">
            About Page Dashboard
          </h1>

          <p className="text-sm md:text-base text-gray-500 mt-2">
            Manage your organization's information, content and visitor
            interactions.
          </p>
        </div>

        <a
          href="/about"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-[#344054] shadow-sm hover:border-[#009FF6] hover:text-[#009FF6] transition-all"
        >
          <Globe size={17} />
          View Live Page
          <ArrowUpRight size={16} />
        </a>
      </div>

      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-[#101828]">
        {/* Decorative Elements */}
        <div className="absolute -right-20 -top-32 w-80 h-80 rounded-full border-[40px] border-white/[0.04]" />
        <div className="absolute right-32 -bottom-36 w-72 h-72 rounded-full bg-[#009FF6]/10 blur-3xl" />

        <div className="relative z-10 p-6 md:p-9 lg:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-7">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-[#55C3FF] text-xs font-semibold tracking-wide">
              <LayoutDashboard size={14} />
              CONTENT MANAGEMENT SYSTEM
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mt-5 leading-tight">
              Manage your About page
              <span className="block text-[#55C3FF]">All in one place.</span>
            </h2>

            <p className="text-sm md:text-base text-gray-300 leading-7 mt-4 max-w-xl">
              Keep your organization's online presence up to date. Manage page
              sections, images, organizational information and visitor
              communication from one dashboard.
            </p>

            <button
              onClick={() => navigate("/admin/about/hero")}
              className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-xl bg-[#009FF6] text-white text-sm font-semibold hover:bg-[#0088D5] transition-colors"
            >
              Manage Content
              <ArrowUpRight size={17} />
            </button>
          </div>

          <div className="hidden lg:flex w-40 h-40 rounded-2xl border border-white/10 bg-white/[0.04] items-center justify-center shrink-0">
            <LayoutDashboard
              size={76}
              strokeWidth={1}
              className="text-[#55C3FF]"
            />
          </div>
        </div>
      </section>

      {/* Overview Statistics */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-[#101828]">Overview</h2>
          <p className="text-sm text-gray-500 mt-1">
            A quick look at your content management structure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.label}
                    </p>

                    <h3 className="text-2xl font-bold text-[#101828] mt-3">
                      {stat.value}
                    </h3>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-[#EAF6FF] text-[#009FF6] flex items-center justify-center">
                    <Icon size={22} />
                  </div>
                </div>

                <p className="text-xs text-gray-400 mt-4">{stat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modules Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl font-bold text-[#101828]">
              Manage About Page
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Select a section to view or update its content.
            </p>
          </div>

          <span className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 px-3 py-2 rounded-lg w-fit">
            <CheckCircle2 size={15} className="text-emerald-500" />8 Available
            Modules
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <button
                key={module.path}
                type="button"
                onClick={() => navigate(module.path)}
                className="group text-left bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-lg hover:border-[#009FF6]/50 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#009FF6] focus:ring-offset-2"
              >
                {/* Card Top */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#EAF6FF] text-[#009FF6] flex items-center justify-center group-hover:bg-[#009FF6] group-hover:text-white transition-all duration-300">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>

                  <span className="text-xs font-bold tracking-wider text-gray-300">
                    {module.number}
                  </span>
                </div>

                {/* Card Content */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#009FF6]">
                    {module.category}
                  </span>

                  <h3 className="text-base font-bold text-[#101828] mt-2 group-hover:text-[#009FF6] transition-colors">
                    {module.title}
                  </h3>

                  <p className="text-sm text-gray-500 leading-6 mt-2 min-h-[48px]">
                    {module.description}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 group-hover:text-[#009FF6] transition-colors">
                    Open Management
                  </span>

                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-[#EAF6FF] group-hover:text-[#009FF6] transition-all">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Bottom Information */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle2 size={22} />
        </div>

        <div>
          <h3 className="text-sm font-bold text-[#101828]">
            Your content management workspace
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Each module provides dedicated controls for managing its
            corresponding website section.
          </p>
        </div>
      </section>
    </div>
  );
}
