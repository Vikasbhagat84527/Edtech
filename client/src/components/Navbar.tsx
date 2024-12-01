"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { FaBell } from "react-icons/fa";
import LogoutModal from "./LogoutModal";
import { useNotifications, Notification } from "@/src/hooks/useNotifications";

const Navbar: React.FC = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { notifications, loading, error } = useNotifications();

  useEffect(() => {
    if (status === "authenticated") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [status]);

  const handleSignOut = async () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      await signOut({ callbackUrl: "/auth/login" });
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  const extractNameInitials = (email: string | undefined) => {
    if (!email) return "";
    const [name] = email.split("@");
    return name;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <nav className="bg-gray-800 text-white flex justify-between items-center px-6 py-4 shadow">
      <div className="text-xl font-bold">
        <Link href="/">Objective Learning</Link>
      </div>

      <div className="flex items-center space-x-4">
        {pathname === "/auth/login" || pathname === "/auth/signup" ? (
          <Link href="/" className="text-white">
            Home
          </Link>
        ) : isAuthenticated ? (
          <>
            <Link href="/" className="text-white">
              Home
            </Link>
            <div className="relative">
              <button onClick={toggleDropdown} className="relative">
                <FaBell className="text-xl" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50"
                >
                  {loading ? (
                    <p className="text-gray-800 text-sm p-4">Loading...</p>
                  ) : error ? (
                    <p className="text-red-500 text-sm p-4">{error}</p>
                  ) : notifications.length > 0 ? (
                    notifications.map(
                      (notification: Notification, index: number) => (
                        <p
                          key={index}
                          className="text-gray-800 text-sm p-4 border-b last:border-b-0"
                        >
                          {notification.message}
                        </p>
                      )
                    )
                  ) : (
                    <p className="text-gray-800 text-sm p-4">
                      No notifications
                    </p>
                  )}
                </div>
              )}
            </div>
            {pathname === "/dashboard" ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded"
              >
                <img
                  src={session?.user?.image || "/default-avatar.png"}
                  alt="User Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span>
                  {extractNameInitials(session?.user?.email ?? undefined)}
                </span>
              </button>
            )}
          </>
        ) : (
          <>
            <Link href="/auth/login" className="text-white">
              Login
            </Link>
            <Link href="/auth/login" className="text-white">
              Signup
            </Link>
          </>
        )}
      </div>
      <LogoutModal
        isOpen={isModalOpen}
        onConfirm={handleSignOut}
        onDiscard={() => setIsModalOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
