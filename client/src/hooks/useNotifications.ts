import { useState, useEffect } from "react";
import axiosInstance from "@/src/utils/axiosInstance";

export interface Notification {
  id: number;
  message: string;
  type: string;
  createdAt: string;
  isRead: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axiosInstance.get("api/notifications/unread");
        setNotifications(data.notifications || []);
      } catch (err) {
        setError("Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return { notifications, loading, error };
};
