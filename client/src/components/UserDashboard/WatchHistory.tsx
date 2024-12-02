"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/src/utils/axiosInstance";

interface Lesson {
  id: number;
  title: string;
  thumbnail: string;
}

const WatchHistory: React.FC = () => {
  const [watchHistory, setWatchHistory] = useState<Lesson[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWatchHistory = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/watch-history/1`);
        setWatchHistory(data.watchHistory || []);
      } catch (err) {
        console.error("Error fetching watch history:", err);
        setError("Failed to load watch history");
      }
    };

    fetchWatchHistory();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!watchHistory.length)
    return <p className="text-gray-600">No watch history available.</p>;

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Watch History</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {watchHistory.map((lesson) => (
          <Link
            href={`/videos/watch-history/${lesson.id}`}
            key={lesson.id}
            className="group"
          >
            <div
              className="relative group rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition"
              style={{ width: "150px", height: "150px" }}
            >
              {/* Card image */}
              <img
                src={lesson.thumbnail || "https://via.placeholder.com/150"}
                alt={lesson.title}
                className="w-full h-full object-cover"
              />
              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-xs p-2 group-hover:bg-opacity-75 transition">
                {lesson.title}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WatchHistory;
