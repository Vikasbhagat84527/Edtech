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
    <div>
      <h2 className="text-xl font-bold mb-4">Bookmarked Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bookmarkedVideos.map((video) => (
          <Link href={`/dashboard/videos/bookmarked`} key={video.id}>
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

export default BookmarkedVideos;
