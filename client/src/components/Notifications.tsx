"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useSession } from "next-auth/react";

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
}

const Notifications: React.FC = () => {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchNotifications = async () => {
        try {
          const { data } = await axiosInstance.get(
            "https://edtech-2-7uho.onrender.com/api/notifications/unread"
          );
          setNotifications(data.notifications);
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();
    } else {
      setLoading(false);
    }
  }, [status]);

  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 shadow-lg rounded-lg overflow-hidden z-50">
      {loading ? (
        <p className="p-4 text-center">Loading...</p>
      ) : notifications.length > 0 ? (
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`px-4 py-2 border-b last:border-b-0 ${
                notification.isRead ? "bg-gray-100" : "bg-gray-200"
              }`}
            >
              {notification.message}
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-4 text-center">No notifications</p>
      )}
    </div>
  );
};

export default Notifications;
