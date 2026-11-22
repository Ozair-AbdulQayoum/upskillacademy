import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/services/values";
const SERVER_URL = "http://localhost:5000";

export default function Values() {
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================
  // FETCH VALUES FROM DATABASE
  // =====================================

  useEffect(() => {
    const fetchValues = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(API_URL);

        setValues(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch values:", err);

        setError("Unable to load values. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchValues();
  }, []);

  // =====================================
  // ICON URL
  // =====================================

  const getIconUrl = (icon) => {
    if (!icon) return "";

    return icon.startsWith("http") ? icon : `${SERVER_URL}${icon}`;
  };

  // =====================================
  // COMPONENT UI
  // =====================================

  return (
    <section className="w-full bg-white px-5 py-16 md:py-20">
      <div className="max-w-[1200px] mx-auto">
        {/* SECTION HEADING */}
        <div className="text-center mb-12">
          <span
            className="inline-block px-4 py-2 mb-5 rounded-full
          bg-[#009BF5]/10 text-[#009BF5] text-sm font-semibold"
          >
            Our Values
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            We Believe in Providing{" "}
            <span className="text-[#009BF5]">Values.</span>
          </h2>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Loading values...
          </div>
        ) : error ? (
          /* ERROR STATE */
          <div className="text-center py-10 text-gray-500">{error}</div>
        ) : values.length === 0 ? (
          /* EMPTY STATE */
          <div className="text-center py-10 text-gray-500">
            No values available at the moment.
          </div>
        ) : (
          /* VALUES CARDS */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value._id}
                className="group bg-white border border-gray-200 rounded-2xl p-7
                hover:border-[#009BF5] hover:shadow-xl
                hover:shadow-[#009BF5]/10 hover:-translate-y-1
                transition-all duration-300"
              >
                {/* ICON */}
                <div
                  className="w-16 h-16 rounded-xl bg-[#009BF5]/10
                  flex items-center justify-center mb-6
                  group-hover:bg-[#009BF5]/15
                  transition-colors duration-300"
                >
                  {value.icon && (
                    <img
                      src={getIconUrl(value.icon)}
                      alt={`${value.title} icon`}
                      loading="lazy"
                      className="w-9 h-9 object-contain
                      group-hover:scale-110
                      transition-transform duration-300"
                    />
                  )}
                </div>

                {/* TITLE */}
                <h3
                  className="text-lg font-bold text-gray-900 mb-3
                  group-hover:text-[#009BF5]
                  transition-colors duration-300"
                >
                  {value.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-sm text-gray-500 leading-7">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
