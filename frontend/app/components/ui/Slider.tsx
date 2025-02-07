"use client"

import { useState } from "react";

const images = [
  "/docs/images/carousel/carousel-1.svg",
  "/docs/images/carousel/carousel-2.svg",
  "/docs/images/carousel/carousel-3.svg",
  "/docs/images/carousel/carousel-4.svg",
  "/docs/images/carousel/carousel-5.svg",
];

export default function App(){
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="">
      <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            className={`absolute block w-full transition-opacity duration-700 ease-in-out top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            alt={`Slide ${index + 1}`}
          />
        ))}
      </div>
      {/* Indicators */}
      <div className="absolute bottom-5 left-1/2 flex space-x-3 -translate-x-1/2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? "bg-gray-900" : "bg-gray-400"
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>
      {/* Controls */}
      <button
        className="absolute top-0 left-0 flex items-center justify-center h-full px-4 cursor-pointer"
        onClick={prevSlide}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 hover:bg-white/50">
          &#10094;
        </span>
      </button>
      <button
        className="absolute top-0 right-0 flex items-center justify-center h-full px-4 cursor-pointer"
        onClick={nextSlide}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 hover:bg-white/50">
          &#10095;
        </span>
      </button>
    </div>
  );
};


