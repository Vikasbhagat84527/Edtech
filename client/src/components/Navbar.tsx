"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const router = useRouter();

  return (
    <nav className="bg-gray-800 text-white py-4 px-8 flex justify-between items-center">
      <div
        className="text-lg font-bold cursor-pointer"
        onClick={() => router.push("/")}
      >
        CompanyName
      </div>
      <div className="space-x-4">
        <button
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition"
          onClick={() => router.push("/")}
        >
          Home
        </button>
        <button
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition"
          onClick={() => router.push("/auth/login")}
        >
          Login
        </button>
        <button
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition"
          onClick={() => router.push("/auth/signup")}
        >
          Signup
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
