"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/src/utils/axiosInstance";

interface Video {
  id: number;
  title: string;
  thumbnail: string;
}

const LikedVideos: React.FC = () => {
  const [likedVideos, setLikedVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/likes/1/liked-videos`);
        setLikedVideos(data || []);
      } catch (err) {
        console.error("Error fetching liked videos:", err);
        setError("Failed to load liked videos");
      }
    };

    fetchLikedVideos();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!likedVideos.length)
    return <p className="text-gray-600">No liked videos available.</p>;

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Liked Videos</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {likedVideos.map((video) => (
          <Link href={`/dashboard/videos/liked/${video.id}`} key={video.id}>
            <div
              className="relative group rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition"
              style={{ width: "150px", height: "150px" }} // Fixed dimensions for cards
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

export default LikedVideos;
