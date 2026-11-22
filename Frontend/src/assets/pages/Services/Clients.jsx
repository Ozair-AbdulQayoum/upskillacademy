import React, { useEffect, useState } from "react";
import axios from "axios";

// ORIGINAL CLIENT LOGOS
import Clients1 from "../../Imgs/Services Page Imgs/abargaam-Logo.webp";
import Clients2 from "../../Imgs/Services Page Imgs/BoshanTradingMIS-Logo.webp";
import Clients3 from "../../Imgs/Services Page Imgs/RGWFMIS-Logo.webp";
import Clients4 from "../../Imgs/Services Page Imgs/PolyglotConnect-Logo.webp";
import Clients5 from "../../Imgs/Services Page Imgs/AWDACO-MIS-Logo.svg";
import Clients6 from "../../Imgs/Services Page Imgs/SpingharUniversity-Logo.webp";
import Clients7 from "../../Imgs/Services Page Imgs/ClockTower-Logo.webp";

const API_URL = "http://localhost:5000/api/services/clients";
const SERVER_URL = "http://localhost:5000";

// ORIGINAL CLIENTS (FALLBACK)
const oldClients = [
  { name: "Abargaam", logo: Clients1 },
  { name: "Boshan Trading MIS", logo: Clients2 },
  { name: "RGWFMIS", logo: Clients3 },
  { name: "Polyglot Connect", logo: Clients4 },
  { name: "AWDACO MIS", logo: Clients5 },
  { name: "Spinghar University", logo: Clients6 },
  { name: "Clock Tower", logo: Clients7 },
];

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH CLIENTS FROM MONGODB
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(API_URL);

        const databaseClients = response.data?.data || [];

        // SHOW DATABASE CLIENTS IF AVAILABLE
        // OTHERWISE SHOW ORIGINAL CLIENTS
        if (databaseClients.length > 0) {
          const formattedClients = databaseClients.map((client) => ({
            ...client,
            logo: `${SERVER_URL}${client.logo}`,
          }));

          setClients(formattedClients);
        } else {
          setClients(oldClients);
        }
      } catch (err) {
        console.error("Failed to fetch clients:", err);

        // API ERROR: SHOW ORIGINAL CLIENTS
        setClients(oldClients);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <section className="w-full bg-white px-5 py-16 md:py-20">
      <div className="max-w-[1200px] mx-auto">
        {/* SECTION HEADING */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 mb-5 rounded-full bg-[#009BF5]/10 text-[#009BF5] text-sm font-semibold">
            Our Clients
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by <span className="text-[#009BF5]">Growing Brands</span>
          </h2>

          <p className="max-w-2xl mx-auto text-gray-500 text-base md:text-lg leading-relaxed">
            We collaborate with startups and established organizations across
            different industries.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="min-h-[160px] rounded-xl border border-gray-200 animate-pulse bg-gray-50"
              />
            ))}
          </div>
        )}

        {/* CLIENT LOGO CARDS */}
        {!loading && clients.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {clients.map((client) => (
              <div
                key={client._id || client.name}
                className="group flex flex-col items-center justify-center
                min-h-[160px] p-6 bg-white border border-gray-200 rounded-xl
                hover:border-[#009BF5] hover:shadow-lg hover:shadow-[#009BF5]/10
                hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-center h-20 w-full mb-4">
                  <img
                    src={client.logo}
                    alt={`${client.name} logo`}
                    loading="lazy"
                    className="max-w-[150px] max-h-16 w-auto h-auto object-contain
                    group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <h3 className="text-sm font-semibold text-gray-700 text-center group-hover:text-[#009BF5] transition-colors duration-300">
                  {client.name}
                </h3>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && clients.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            Our client logos will be displayed here soon.
          </div>
        )}
      </div>
    </section>
  );
}
