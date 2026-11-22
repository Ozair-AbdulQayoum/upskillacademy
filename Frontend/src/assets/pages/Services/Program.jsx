import React, { useEffect, useState } from "react";
import axios from "axios";

import WebIcon from "../../Imgs/Services Page Imgs/Web-icon.svg";
import UIIcon from "../../Imgs/Services Page Imgs/UIUX-Design-icon.svg";
import GraphicIcon from "../../Imgs/Services Page Imgs/Graphic-Design-icon.svg";
import DigitalIcon from "../../Imgs/Services Page Imgs/Digital-Marketing-icon.svg";
import AIIcon from "../../Imgs/Services Page Imgs/AI-icon.svg";
import MobDevIcon from "../../Imgs/Services Page Imgs/MobileAppDevelopment-icon.svg";

const API_URL = "http://localhost:5000/api/services/programs";

// Match database icon keys with existing SVG files
const iconMap = {
  web: WebIcon,
  uiux: UIIcon,
  graphic: GraphicIcon,
  digital: DigitalIcon,
  ai: AIIcon,
  mobile: MobDevIcon,
};

export default function Program() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch programs from MongoDB
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(API_URL);

        if (!Array.isArray(response.data?.data)) {
          throw new Error("Invalid programs response.");
        }

        setPrograms(response.data.data);
      } catch (err) {
        console.error("Failed to fetch services programs:", err);

        setError("Unable to load programs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <section className="w-full bg-white px-5 py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto">
        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-[#009FF6]/20 border-t-[#009FF6] rounded-full animate-spin mx-auto mb-4" />

            <p className="text-gray-500 text-sm">Loading programs...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-16">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && programs.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Programs Available
            </h3>

            <p className="text-gray-500 text-sm">
              Our programs will be available soon.
            </p>
          </div>
        )}

        {/* Dynamic Service Cards */}
        {!loading && !error && programs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {programs.map((program) => (
              <div
                key={program._id}
                className="group bg-white border border-gray-200 rounded-2xl p-7 md:p-8 hover:border-[#009FF6] hover:shadow-xl hover:shadow-[#009FF6]/10 transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-xl bg-[#009FF6]/10 flex items-center justify-center mb-6 group-hover:bg-[#009FF6]/15 transition-colors duration-300">
                  {iconMap[program.icon] ? (
                    <img
                      src={iconMap[program.icon]}
                      alt={`${program.title} icon`}
                      className="w-9 h-9 object-contain"
                    />
                  ) : (
                    <span className="text-[#009FF6] text-2xl font-bold">
                      {program.title?.charAt(0) || "?"}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {program.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-7 mb-7">
                  {program.description}
                </p>

                {/* Key Features */}
                <div className="mb-7">
                  <h4 className="text-sm font-bold text-gray-900 mb-4">
                    Key Features:
                  </h4>

                  <ul className="space-y-3">
                    {program.features?.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-gray-600"
                      >
                        <span className="text-[#009FF6] font-bold mt-0.5">
                          •
                        </span>

                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div className="border-t border-gray-100 pt-6">
                  <h4 className="text-sm font-bold text-gray-900 mb-4">
                    Technologies:
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {program.technologies?.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-600 text-xs font-medium hover:bg-[#009FF6]/10 hover:text-[#009FF6] transition-colors duration-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
