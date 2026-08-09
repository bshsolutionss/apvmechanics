"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/common/section-heading";
import { GalleryModal } from "@/components/modals/gallery-modal";

const GALLERY_IMAGES = [
  { src: "/assets/images/project/apv-real-1.png", alt: "APV mechanic removing a worn engine component during repair" },
  { src: "/assets/images/project/apv-real-2.jpg", alt: "APV mechanic inspecting serpentine belt and engine pulleys" },
  { src: "/assets/images/project/apv-real-3.jpg", alt: "APV mobile mechanic working on vehicle engine bay" },
  { src: "/assets/images/project/apv-real-4.jpg", alt: "Full engine bay inspection on Ford vehicle by APV Mobile Mechanics" },
  { src: "/assets/images/project/apv-real-5.jpg", alt: "APV mechanic servicing engine components with diagnostic tools" },
  { src: "/assets/images/project/apv-real-6.jpg", alt: "Close-up engine repair work performed by APV Mobile Mechanics Hobart" },
];

export function GalleryLightbox() {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  const change = (direction: number) =>
    setActive((current) =>
      current === null ? 0 : (current + direction + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
    );

  return (
    <section className="section gallery" id="projects">
      <div className="container">
        <SectionHeading
          eyebrow="OUR PROJECTS"
          title={<>Gallery of Trusted Repairs <em>Real Cars, Real Results</em></>}
          center
        />
      </div>
      <div className="gallery-grid">
        {GALLERY_IMAGES.map((img, index) => (
          <button
            key={img.src}
            onClick={() => setActive(index)}
            aria-label={img.alt}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="25vw"
              style={{ objectFit: "cover" }}
            />
            <span>
              <Search />
            </span>
          </button>
        ))}
      </div>
      {active !== null && (
        <GalleryModal
          imageSrc={GALLERY_IMAGES[active].src}
          imageAlt={GALLERY_IMAGES[active].alt}
          onClose={() => setActive(null)}
          onChange={change}
        />
      )}
    </section>
  );
}
