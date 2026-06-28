import React from "react";
import bannerImg from "../assets/Banner.jpeg";

export default function Banner() {
  return (
    <section className="relative w-full h-105 md:h-135 overflow-hidden rounded-3xl mt-6 shadow-2xl group">
      {/* IMAGE */}
      <img
        src={bannerImg}
        alt="Fashion and beauty banner"
        className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out"
      />

      {/* DARK OVERLAY FOR READABILITY */}
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-black/10"></div>

      {/* CONTENT WRAPPER */}
      <div className="absolute inset-0 flex items-center">
        <div className="px-6 md:px-16 max-w-2xl">
          {/* TAG */}
          <span className="inline-block mb-3 px-4 py-1 text-xs md:text-sm tracking-widest uppercase text-white/80 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            New Season 2026
          </span>

          {/* HEADING */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            Style That Defines You
          </h1>

          {/* DESCRIPTION */}
          <p className="mt-4 text-white/80 text-sm md:text-base leading-relaxed max-w-lg">
            Discover premium fashion, beauty essentials, and accessories curated
            to elevate your everyday look.
          </p>

          {/* BUTTONS */}
          <div className="mt-6 flex items-center gap-4">
            <button
              className="px-6 py-3 rounded-xl bg-linear-to-r from-pink-500 to-rose-600
              text-white font-semibold shadow-lg hover:shadow-pink-500/40
              hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
              aria-label="Shop collection"
            >
              Shop Now
            </button>

            <button
              className="px-6 py-3 rounded-xl border border-white/30 text-white
              hover:bg-white/10 backdrop-blur-md transition-all duration-300"
              aria-label="View categories"
            >
              Explore
            </button>
          </div>
        </div>
      </div>

      {/* FLOATING DECOR ELEMENTS */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-pink-400/20 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-rose-400/20 blur-3xl rounded-full animate-pulse"></div>

      {/* OPTIONAL LIGHT GLOW */}
      <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-black/20 via-transparent to-transparent"></div>
    </section>
  );
}
