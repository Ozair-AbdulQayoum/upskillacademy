import React, { useEffect, useState } from "react";

import Img1 from "../../Imgs/Scholarships Page Imgs/Img-4.webp";
import Img2 from "../../Imgs/Scholarships Page Imgs/Img-3.webp";
import Img3 from "../../Imgs/Scholarships Page Imgs/Img-8.webp";
import Img4 from "../../Imgs/Scholarships Page Imgs/Img-5.webp";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

const DEFAULT_FAQS = [
  {
    question: "What is this scholarship program?",
    answer:
      "This is a special opportunity to join our professional training courses with limited scholarship seats available.",
  },
  {
    question: "Who can apply for the scholarship?",
    answer:
      "Anyone who is motivated to learn and build their career can apply. Students, university learners, and job seekers are welcome.",
  },
  {
    question: "How many scholarships are available?",
    answer: "We are offering 300 scholarships for this program.",
  },
  {
    question: "How will I be notified?",
    answer:
      "We contact applicants through the email or WhatsApp number you provide.",
  },
  {
    question: "Can I change my program after applying?",
    answer: "Yes, you can request a change by contacting our support team.",
  },
  {
    question: "Is there a deadline to apply?",
    answer:
      "Yes. Seats are limited, and registration will close once all 300 scholarships are filled.",
  },
  {
    question: "What courses are included in the scholarship?",
    answer:
      "The scholarship covers selected professional skill-based courses designed to help you grow in your career.",
  },
  {
    question: "How will I know if I am selected?",
    answer:
      "Our team will contact shortlisted applicants after reviewing applications.",
  },
];

const DEFAULT_IMAGES = [Img1, Img2, Img3, Img4];

const IMAGE_KEYS = ["image1", "image2", "image3", "image4"];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(0);

  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [gallery, setGallery] = useState(null);

  // ==============================
  // IMAGE URL
  // ==============================

  const getImageUrl = (url) => {
    if (!url) return "";

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  // ==============================
  // FETCH PUBLIC FAQS
  // ==============================

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch(`${API_BASE}/scholarship/faqs`);

        if (!response.ok) {
          throw new Error("Failed to fetch FAQs.");
        }

        const result = await response.json();

        const faqList = Array.isArray(result)
          ? result
          : result.faqs || result.data?.faqs || result.data || [];

        if (Array.isArray(faqList)) {
          setFaqs(faqList);
        }
      } catch (error) {
        console.error("FAQ loading error:", error);
        // Keep default FAQs if the API is unavailable.
      }
    };

    fetchFAQs();
  }, []);

  // ==============================
  // FETCH PUBLIC FAQ GALLERY
  // ==============================

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(`${API_BASE}/scholarship/faqs/gallery`);

        if (!response.ok) {
          throw new Error("Failed to fetch FAQ gallery.");
        }

        const result = await response.json();

        const galleryData =
          result.gallery || result.data?.gallery || result.data || {};

        setGallery(galleryData);
      } catch (error) {
        console.error("FAQ gallery loading error:", error);
        // Keep the original imported images if the API is unavailable.
      }
    };

    fetchGallery();
  }, []);

  // ==============================
  // PREPARE GALLERY IMAGES
  // ==============================

  const galleryImages = IMAGE_KEYS.map((key, index) => {
    const image = gallery?.[key];

    // Uploaded image exists and is published.
    if (image?.url && image.isVisible !== false) {
      return {
        key,
        src: getImageUrl(image.url),
        alt: `Upskill scholarship gallery image ${index + 1}`,
      };
    }

    // Uploaded image exists but is hidden.
    // Do not display the fallback for a deliberately hidden image.
    if (image?.url && image.isVisible === false) {
      return null;
    }

    // No uploaded image: use the original static image.
    return {
      key,
      src: DEFAULT_IMAGES[index],
      alt: `Upskill scholarship gallery image ${index + 1}`,
    };
  }).filter(Boolean);

  // ==============================
  // GALLERY IMAGE COMPONENT
  // ==============================

  const GalleryImage = ({ image, className }) => (
    <div className={`overflow-hidden rounded-2xl ${className}`}>
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
      />
    </div>
  );

  // ==============================
  // UI
  // ==============================

  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* LEFT SIDE - IMAGE GALLERY */}
          <div className="w-full space-y-4">
            {/* TOP IMAGE */}
            {galleryImages[0] && (
              <GalleryImage image={galleryImages[0]} className="h-64 sm:h-80" />
            )}

            {/* MIDDLE TWO IMAGES */}
            {(galleryImages[1] || galleryImages[2]) && (
              <div className="grid grid-cols-2 gap-4">
                {galleryImages[1] && (
                  <GalleryImage
                    image={galleryImages[1]}
                    className="h-48 sm:h-56"
                  />
                )}

                {galleryImages[2] && (
                  <GalleryImage
                    image={galleryImages[2]}
                    className="h-48 sm:h-56"
                  />
                )}
              </div>
            )}

            {/* BOTTOM IMAGE */}
            {galleryImages[3] && (
              <GalleryImage image={galleryImages[3]} className="h-64 sm:h-80" />
            )}
          </div>

          {/* RIGHT SIDE - FAQs */}
          <div className="w-full">
            <span className="inline-block rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-[#009FF6]">
              FAQs
            </span>

            {/* FAQ ACCORDION */}
            <div className="mt-6 space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={faq._id || index}
                  className={`overflow-hidden rounded-xl border transition-all duration-300 ${
                    openIndex === index
                      ? "border-blue-200 bg-blue-50/50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-blue-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex(openIndex === index ? -1 : index)
                    }
                    className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5"
                  >
                    <span className="text-sm font-semibold leading-6 text-gray-900 sm:text-base">
                      {faq.question}
                    </span>

                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-semibold transition-all duration-300 ${
                        openIndex === index
                          ? "rotate-45 bg-[#009FF6] text-white"
                          : "bg-blue-50 text-[#009FF6]"
                      }`}
                    >
                      +
                    </span>
                  </button>

                  {openIndex === index && (
                    <div className="px-4 pb-5 sm:px-5">
                      <div className="border-t border-blue-100 pt-4">
                        <p className="text-sm leading-7 text-gray-600 sm:text-base">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
