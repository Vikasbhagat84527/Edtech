"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const UserSection: React.FC = () => {
  const { data: session } = useSession(); // Fetch user data from NextAuth session
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("user@gmail.com");
  const [profilePicture, setProfilePicture] = useState("/default-avatar.png");

  useEffect(() => {
    if (session?.user) {
      // Use NextAuth session data if available
      setUserName(session.user.name || "User");
      setUserEmail(session.user.email || "user@gmail.com");
      setProfilePicture(session.user.image || "/default-avatar.png");
    } else {
      // Fallback to localStorage for manual login
      const name = localStorage.getItem("userName");
      const email = localStorage.getItem("userEmail");
      const picture = localStorage.getItem("userProfilePicture");

      if (name) setUserName(name);
      if (email) setUserEmail(email);
      if (picture) setProfilePicture(picture);
    }
  }, [session]);

  return (
    <div className="bg-white shadow p-6 rounded-lg flex items-center space-x-6 mb-6">
      <img
        src={profilePicture}
        alt="User"
        className="w-24 h-24 rounded-full object-cover"
      />
      <div>
        <h2 className="text-2xl font-bold">{userName}</h2>
        <p className="text-gray-600">{userEmail}</p>
      </div>
    </div>
  );
};

export default UserSection;
