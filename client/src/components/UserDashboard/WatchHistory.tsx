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
    <div>
      <h2 className="text-xl font-bold mb-4">Watch History</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {watchHistory.map((lesson) => (
          <Link
            href={`/videos/watch-history`}
            key={lesson.id}
            className="group"
          >
            <div className="relative bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
              <img
                src={lesson.thumbnail || "https://via.placeholder.com/150"}
                alt={lesson.title}
                className="w-full h-40 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-center py-2 group-hover:bg-opacity-80 transition">
                <h3 className="text-lg font-semibold">{lesson.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WatchHistory;
