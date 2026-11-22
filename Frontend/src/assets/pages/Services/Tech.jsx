import React, { useEffect, useState } from "react";
import axios from "axios";

import MySQLIcon from "../../Imgs/Services Page Imgs/mysql-icon.svg";
import PostgreSQLIcon from "../../Imgs/Services Page Imgs/postgresql-icon.svg";
import MongoDBIcon from "../../Imgs/Services Page Imgs/mongodb-icon.svg";
import VueJSIcon from "../../Imgs/Services Page Imgs/vuejs-icon.svg";
import ReactjsIcon from "../../Imgs/Services Page Imgs/react-icon.svg";
import BootstrapIcon from "../../Imgs/Services Page Imgs/bootstrap-icon.svg";
import TailwindCSSIcon from "../../Imgs/Services Page Imgs/tailwindcss-icon.svg";
import SvelteLIcon from "../../Imgs/Services Page Imgs/svelte-icon.svg";
import AngularIcon from "../../Imgs/Services Page Imgs/angularjs-icon.svg";
import FirebaseIcon from "../../Imgs/Services Page Imgs/firebase-icon.svg";
import JavaScriptIcon from "../../Imgs/Services Page Imgs/javascript-icon.svg";
import TypeScriptIcon from "../../Imgs/Services Page Imgs/typescript-icon.svg";
import NextjsIcon from "../../Imgs/Services Page Imgs/nextjs-icon.svg";
import LaravelIcon from "../../Imgs/Services Page Imgs/laravel-icon.svg";
import GitLabIcon from "../../Imgs/Services Page Imgs/gitlab-icon.svg";
import GitHubIcon from "../../Imgs/Services Page Imgs/github-icon.svg";
import DigitalOceanIcon from "../../Imgs/Services Page Imgs/digitalocean-icon.svg";
import HostingerIcon from "../../Imgs/Services Page Imgs/Hostinger-icon.svg";
import DockerIcon from "../../Imgs/Services Page Imgs/docker-icon.svg";
import KubernetesIcon from "../../Imgs/Services Page Imgs/kubernetes-icon.svg";
import PHPIcon from "../../Imgs/Services Page Imgs/php-icon.svg";
import NodejsIcon from "../../Imgs/Services Page Imgs/nodejs-icon.svg";
import ExpressIcon from "../../Imgs/Services Page Imgs/express-icon.svg";

const API_URL = "http://localhost:5000/api/services/technologies";

// Match database icon identifiers with existing SVG files
const iconMap = {
  mysql: MySQLIcon,
  postgresql: PostgreSQLIcon,
  mongodb: MongoDBIcon,
  vuejs: VueJSIcon,
  react: ReactjsIcon,
  bootstrap: BootstrapIcon,
  tailwindcss: TailwindCSSIcon,
  svelte: SvelteLIcon,
  angular: AngularIcon,
  firebase: FirebaseIcon,
  javascript: JavaScriptIcon,
  typescript: TypeScriptIcon,
  nextjs: NextjsIcon,
  laravel: LaravelIcon,
  gitlab: GitLabIcon,
  github: GitHubIcon,
  digitalocean: DigitalOceanIcon,
  hostinger: HostingerIcon,
  docker: DockerIcon,
  kubernetes: KubernetesIcon,
  php: PHPIcon,
  nodejs: NodejsIcon,
  express: ExpressIcon,
};

export default function Tech() {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(API_URL);
        const data = response.data?.data;

        setTechnologies(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch Public Technologies:", err);
        setError("Unable to load technologies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologies();
  }, []);

  return (
    <section className="w-full bg-white px-5 py-16 md:py-20">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gray-900">Our Technology</span>{" "}
            <span className="text-[#009BF5]">Expertise</span>
          </h2>

          <p className="max-w-2xl mx-auto text-gray-500 text-base md:text-lg leading-relaxed">
            Equipped with the latest tools, our teams deliver impactful
            solutions designed to grow your business.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-9 h-9 border-4 border-blue-100 border-t-[#009BF5] rounded-full animate-spin mx-auto" />
            <p className="text-gray-500 text-sm mt-4">
              Loading technologies...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <p className="text-center text-red-500 py-10">{error}</p>
        )}

        {/* Empty State */}
        {!loading && !error && technologies.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            No technologies available at the moment.
          </p>
        )}

        {/* Technology Grid */}
        {!loading && !error && technologies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
            {technologies.map((tech) => {
              const technologyIcon = iconMap[tech.icon?.toLowerCase()];

              return (
                <div
                  key={tech._id}
                  className="group flex flex-col items-center justify-center gap-3
                  bg-white border border-gray-200 rounded-xl
                  min-h-[125px] p-4
                  hover:border-[#009FF6] hover:shadow-lg hover:shadow-[#009FF6]/10
                  hover:-translate-y-1 transition-all duration-300"
                >
                  {technologyIcon ? (
                    <img
                      src={technologyIcon}
                      alt={tech.name}
                      className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#009BF5] flex items-center justify-center font-bold text-lg">
                      {tech.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  )}

                  <h3 className="text-sm font-semibold text-gray-700 text-center group-hover:text-[#009FF6] transition-colors duration-300">
                    {tech.name}
                  </h3>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Blue Banner */}
        <div className="mt-8 mx-auto w-fit bg-[#009BF5] rounded-lg px-4 py-2">
          <p className="text-white text-xs sm:text-sm font-medium text-center">
            Web, design, marketing and AI services
          </p>
        </div>
      </div>
    </section>
  );
}
