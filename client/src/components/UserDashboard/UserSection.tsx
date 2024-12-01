"use client";

import React, { useEffect, useState } from "react";

const UserSection: React.FC = () => {
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("user@gmail.com");
  const [profilePicture, setProfilePicture] = useState("/default-avatar.png");

  useEffect(() => {
    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");
    const picture = localStorage.getItem("userProfilePicture");

    if (name) setUserName(name);
    if (email) setUserEmail(email);
    if (picture) setProfilePicture(picture);
  }, []);

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
