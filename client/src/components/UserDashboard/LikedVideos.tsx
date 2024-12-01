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
    <div>
      <h2 className="text-xl font-bold mb-4">Liked Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {likedVideos.map((video) => (
          <Link href={`/dashboard/videos/liked`} key={video.id}>
            <div className="bg-white shadow p-4 rounded-lg cursor-pointer">
              <img
                src={video.thumbnail || "https://via.placeholder.com/150"}
                alt={video.title}
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
              <h3 className="text-lg font-semibold">{video.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LikedVideos;
