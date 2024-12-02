"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/src/utils/axiosInstance";

interface Video {
  id: number;
  title: string;
  thumbnail: string;
}

const BookmarkedVideos: React.FC = () => {
  const [bookmarkedVideos, setBookmarkedVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookmarkedVideos = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/1/bookmarked-videos`);
        setBookmarkedVideos(data || []);
      } catch (err) {
        console.error("Error fetching bookmarked videos:", err);
        setError("Failed to load bookmarked videos");
      }
    };

    fetchBookmarkedVideos();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!bookmarkedVideos.length)
    return <p className="text-gray-600">No bookmarked videos available.</p>;

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Bookmarked Videos</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {bookmarkedVideos.map((video) => (
          <Link
            href={`/dashboard/videos/bookmarked/${video.id}`}
            key={video.id}
          >
            <div
              className="relative group rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition"
              style={{ width: "150px", height: "150px" }} // Fixed card dimensions
            >
              {/* Card image */}
              <img
                src={video.thumbnail || "https://via.placeholder.com/150"}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-xs p-2 group-hover:bg-opacity-75 transition">
                {video.title}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BookmarkedVideos;
