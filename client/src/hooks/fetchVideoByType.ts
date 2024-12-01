import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
interface Video {
  id: number;
  title: string;
  thumbnail: string;
  duration: string;
}
async function fetchVideosByType(type: string): Promise<Video[]> {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("Missing token");
    }

    const response = await axiosInstance.get(`/api/videos/${type}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach token
      },
    });

    return response.data.map((video: any) => ({
      id: video.id,
      title: video.title,
      thumbnail: video.thumbnail,
      duration: video.duration,
    }));
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
}
