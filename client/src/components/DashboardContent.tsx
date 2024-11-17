"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../utils/axiosInstance";

const DashboardContent = () => {
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        return;
      }
      try {
        const response = await axiosInstance.get(
          "http://localhost:5000/api/dashboard/user",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUserData(response.data);
        if (response.status === 200) {
          router.push("/dashboard");
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          // Token expired; log the user out
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          router.push("/auth/login");
        } else {
          setError(err.response?.data?.error || "Failed to fetch data.");
        }
      }
    };

    fetchData();
  }, [router]);

  if (error) {
    return <p className="text-green-500">{error}</p>;
  }

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        Welcome, {userData.name || "User"}!
      </h2>
      <p>Email: {userData.email}</p>
      <p>
        Account Created: {new Date(userData.createdAt).toLocaleDateString()}
      </p>
      <div className="mt-4">
        <h3 className="text-xl font-semibold">Watch History:</h3>
        <ul className="list-disc pl-4">
          {userData.watchHistory?.map((item: any, index: number) => (
            <li key={index}>
              {item.title} - {item.dateWatched}
            </li>
          )) || <p>No watch history yet.</p>}
        </ul>
      </div>
    </div>
  );
};

export default DashboardContent;
