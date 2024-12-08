"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Typewriter from "typewriter-effect";

const HeroSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(
        `https://edtech-2-7uho.onrender.com/search?query=${encodeURIComponent(
          searchQuery
        )}`
      );
    }
  };

  return (
    <div className="relative bg-white min-h-[80vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden">
      <div className="text-4xl font-extrabold text-gray-800 mb-8 z-10">
        <Typewriter
          options={{
            strings: ["What do you want to learn today?"],
            autoStart: true,
            loop: true,
            delay: 50,
            deleteSpeed: 50,
          }}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center w-full max-w-2xl space-y-4 sm:space-y-0 sm:space-x-4 z-10">
        <input
          type="text"
          placeholder="Search topics..."
          className="w-full px-6 py-4 text-gray-800 border border-gray-300 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-gray-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="px-6 py-4 bg-gray-800 text-white font-medium rounded-full hover:bg-gray-700 transition shadow"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
