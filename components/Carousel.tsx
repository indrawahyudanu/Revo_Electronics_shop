"use client";

import { useState, useEffect } from "react";
import Image from "next/image";



const BANNERS = [
  { src: "/images/banner1.jpg", alt: "Banner Promo 1" },
  { src: "/images/banner1.jpg", alt: "Banner Promo 2" },
  { src: "/images/banner1.jpg", alt: "Banner Promo 3" },
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = BANNERS.length;

  // Pengganti moveSlide(direction)
  const moveSlide = (direction: number) => {
    setCurrentIndex((i) => (i + direction + totalSlides) % totalSlides);
  };

  // Auto slide setiap 4 detik
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % totalSlides);
    }, 4000);
    return () => clearInterval(id); // bersihkan timer saat komponen hilang
  }, [totalSlides]);

  return (
    <div className="carousel-container">
      <div
        className="carousel-slide"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {BANNERS.map((b, i) => (
          <Image
            key={b.src}
            src={b.src}
            alt={b.alt}
            width={1200}
            height={400}
            priority={i === 0}
          />
        ))}
      </div>

      <button
        type="button"
        className="carousel-btn prev"
        onClick={() => moveSlide(-1)}
        aria-label="Banner sebelumnya"
      >
        &#10094;
      </button>
      <button
        type="button"
        className="carousel-btn next"
        onClick={() => moveSlide(1)}
        aria-label="Banner berikutnya"
      >
        &#10095;
      </button>

      <div className="carousel-dots">
        {BANNERS.map((b, i) => (
          <button
            key={b.src}
            type="button"
            className={`dot ${i === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Ke banner ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
