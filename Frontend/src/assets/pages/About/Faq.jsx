import React, { useEffect, useState } from "react";
import api from "../../../services/api";

export default function Faq() {
  const [faqData, setFaqData] = useState([]);
  const [title, setTitle] = useState("Frequently Asked Questions");
  const [description, setDescription] = useState(
    "Everything you need to know about Upskill Academy",
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // =====================================
  // FETCH FAQ DATA
  // =====================================
  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const response = await api.get("/about/faq");

        if (response.data.success && response.data.data) {
          const data = response.data.data;

          setTitle(data.title || "Frequently Asked Questions");
          setDescription(
            data.description ||
              "Everything you need to know about Upskill Academy",
          );
          setFaqData(data.questions || []);
        }
      } catch (error) {
        console.error("Failed to fetch FAQ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaq();
  }, []);

  // =====================================
  // TOGGLE FAQ
  // =====================================
  const toggleFaq = (index) => {
    setActiveIndex((current) => (current === index ? null : index));
  };

  // =====================================
  // PRESERVE BOLD TEXT
  // =====================================
  const renderAnswer = (answer = "") => {
    const boldPhrases = [
      "empower Afghanistan’s next generation",
      "open to everyone",
      "online learning platform",
      "digital and professional skills",
      "upskill, gain practical knowledge, or advance their careers",
    ];

    const pattern = new RegExp(
      `(${boldPhrases
        .map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|")})`,
      "gi",
    );

    return answer.split(pattern).map((part, index) => {
      const isBold = boldPhrases.some(
        (phrase) => phrase.toLowerCase() === part.toLowerCase(),
      );

      return isBold ? <strong key={index}>{part}</strong> : part;
    });
  };

  // =====================================
  // LOADING STATE
  // =====================================
  if (loading) {
    return (
      <section className="w-full bg-white py-20 px-5 md:px-10 lg:px-16">
        <div className="max-w-[1000px] mx-auto text-center text-gray-500">
          Loading FAQs...
        </div>
      </section>
    );
  }

  // =====================================
  // MAIN UI
  // =====================================
  return (
    <section className="w-full bg-white py-20 px-5 md:px-10 lg:px-16">
      <div className="max-w-[1000px] mx-auto">
        {/* SECTION HEADING */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#101828] leading-tight mb-5">
            {title}
          </h2>

          <p className="text-gray-600 text-base md:text-lg leading-8">
            {description}
          </p>
        </div>

        {/* FAQ ACCORDION */}
        <div className="space-y-4">
          {faqData.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={faq._id || index}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? "border-[#009FF6]/40 shadow-md"
                    : "border-gray-200 hover:border-[#009FF6]/40"
                }`}
              >
                {/* QUESTION */}
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  className="w-full flex items-center justify-between gap-5 text-left p-5 md:p-6"
                >
                  <span className="text-base md:text-lg font-semibold text-[#101828]">
                    {faq.question}
                  </span>

                  <span
                    className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? "bg-[#009FF6] text-white rotate-180"
                        : "bg-[#F0F8FF] text-[#009FF6]"
                    }`}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </button>

                {/* ANSWER */}
                <div
                  id={`faq-answer-${index}`}
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 md:px-6 pb-6 text-sm md:text-base text-gray-600 leading-7 border-t border-gray-100 pt-5">
                      {renderAnswer(faq.answer)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* EMPTY STATE */}
          {faqData.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No frequently asked questions available.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
