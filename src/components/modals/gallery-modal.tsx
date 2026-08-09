"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface GalleryModalProps {
  imageSrc: string;
  imageAlt: string;
  onClose: () => void;
  onChange: (direction: number) => void;
}

export function GalleryModal({ imageSrc, imageAlt, onClose, onChange }: GalleryModalProps) {
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Automotive project gallery">
      <button className="lightbox__close" onClick={onClose} aria-label="Close gallery">
        <X />
      </button>
      <button className="lightbox__prev" onClick={() => onChange(-1)} aria-label="Previous project">
        <ChevronLeft />
      </button>
      <div className="lightbox__image">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="90vw"
          priority
          style={{ objectFit: "contain" }}
        />
      </div>
      <button className="lightbox__next" onClick={() => onChange(1)} aria-label="Next project">
        <ChevronRight />
      </button>
    </div>
  );
}
