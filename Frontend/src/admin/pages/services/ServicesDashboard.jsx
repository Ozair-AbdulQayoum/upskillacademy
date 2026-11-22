import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Image,
  Code,
  Cpu,
  Briefcase,
  Star,
  ArrowRight,
  Layers,
} from "lucide-react";

const sections = [
  {
    title: "Hero Section",
    description: "Manage the Services page badge, heading, and description.",
    path: "/admin/services/hero",
    icon: Image,
  },
  {
    title: "Program",
    description: "Manage programs and their content.",
    path: "/admin/services/program",
    icon: Code,
  },
  {
    title: "Tech",
    description: "Manage technology and technical information.",
    path: "/admin/services/tech",
    icon: Cpu,
  },
  {
    title: "Clients",
    description: "Manage client information and logos.",
    path: "/admin/services/clients",
    icon: Briefcase,
  },
  {
    title: "Values",
    description: "Manage the values displayed on the Services page.",
    path: "/admin/services/values",
    icon: Star,
  },
];

export default function ServicesDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-[#009FF6]/10 text-[#009FF6] flex items-center justify-center">
            <Layers size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Services Management
            </h1>
            <p className="text-sm text-gray-500">
              Manage and update your public Services page.
            </p>
          </div>
        </div>
      </div>

      {/* Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <button
              key={section.path}
              onClick={() => navigate(section.path)}
              className="group text-left bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#009FF6] hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-[#009FF6]/10 text-[#009FF6] flex items-center justify-center group-hover:bg-[#009FF6] group-hover:text-white transition">
                  <Icon size={23} />
                </div>

                <ArrowRight
                  size={20}
                  className="text-gray-400 group-hover:text-[#009FF6] group-hover:translate-x-1 transition"
                />
              </div>

              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {section.title}
              </h2>

              <p className="text-sm text-gray-500 leading-relaxed">
                {section.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
