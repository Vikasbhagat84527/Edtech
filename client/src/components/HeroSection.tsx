"use client";

import React from "react";
import Typewriter from "typewriter-effect";

const HeroSection: React.FC = () => {
  return (
    <div className="bg-white min-h-[80vh] flex flex-col justify-center items-center text-center px-4">
      {/* Animated Text */}
      <div className="text-4xl font-extrabold text-gray-800 mb-8">
        <Typewriter
          options={{
            strings: ["What do you want to learn today?"],
            autoStart: true,
            loop: true,
            delay: 50, // Speed up typing
            deleteSpeed: 50, // Reduced delay between loops
          }}
        />
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center w-full max-w-2xl space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          placeholder="Search topics..."
          className="w-full px-6 py-4 text-gray-800 border border-gray-300 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <button className="px-6 py-4 bg-gray-800 text-white font-medium rounded-full hover:bg-gray-700 transition shadow">
          Search
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
