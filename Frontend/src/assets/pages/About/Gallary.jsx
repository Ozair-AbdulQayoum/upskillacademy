import React, { useEffect, useState } from "react";
import api from "../../../services/api";

export default function Gallary() {
  const [gallery, setGallery] = useState({
    description: "",
    images: [],
  });

  const [loading, setLoading] = useState(true);

  // =====================================
  // FETCH GALLERY FROM BACKEND
  // =====================================
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await api.get("/about/gallery");

        if (response.data.success && response.data.data) {
          setGallery({
            description: response.data.data.description || "",
            images: response.data.data.images || [],
          });
        }
      } catch (error) {
        console.error("Failed to fetch Gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // =====================================
  // DESCRIPTION FORMATTING
  // =====================================
  const descriptionPrefix = "At Upskill Academy,";

  const descriptionStartsWithPrefix = gallery.description
    .toLowerCase()
    .startsWith(descriptionPrefix.toLowerCase());

  const descriptionText = descriptionStartsWithPrefix
    ? gallery.description.slice(descriptionPrefix.length)
    : gallery.description;

  // =====================================
  // LOADING STATE
  // =====================================
  if (loading) {
    return (
      <section className="w-full bg-white py-16 px-5 md:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          Loading gallery...
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-16 px-5 md:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-[18px]">
        {/* INTRO TEXT */}
        <div className="lg:col-span-2 flex items-start">
          <h2 className="text-2xl md:text-3xl lg:text-[30px] leading-[1.45] font-medium text-gray-950">
            {descriptionStartsWithPrefix ? (
              <>
                At <span className="text-[#079BF4]">Upskill Academy</span>,
                {descriptionText}
              </>
            ) : (
              gallery.description
            )}
          </h2>
        </div>

        {/* DYNAMIC GALLERY IMAGES */}
        {gallery.images.map((image, index) => (
          <div
            key={index}
            className={`overflow-hidden rounded-2xl gallery-img-${index + 1}`}
          >
            <img
              src={image}
              alt={`Upskill Academy gallery ${index + 1}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* RESPONSIVE GALLERY LAYOUT */}
      <style>{`
        @media (min-width: 1024px) {
          .gallery-img-1 {
            grid-column: 1;
            grid-row: 2 / span 2;
            height: 280px;
          }

          .gallery-img-2 {
            grid-column: 2;
            grid-row: 2;
            height: 180px;
          }

          .gallery-img-3 {
            grid-column: 2;
            grid-row: 3 / span 2;
            height: 230px;
          }

          .gallery-img-4 {
            grid-column: 3;
            grid-row: 1 / span 2;
            height: 378px;
          }

          .gallery-img-5 {
            grid-column: 3;
            grid-row: 3;
            height: 180px;
          }

          .gallery-img-6 {
            grid-column: 4;
            grid-row: 2;
            height: 280px;
          }

          .gallery-img-7 {
            grid-column: 4;
            grid-row: 3 / span 2;
            height: 230px;
          }
        }

        @media (max-width: 1023px) {
          .gallery-img-1,
          .gallery-img-2,
          .gallery-img-3,
          .gallery-img-4,
          .gallery-img-5,
          .gallery-img-6,
          .gallery-img-7 {
            height: 240px;
          }
        }
      `}</style>
    </section>
  );
}
