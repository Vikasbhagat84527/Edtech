"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const DashboardNavbar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
    router.push("/auth/login");
  };

  return (
    <nav className="bg-slate-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">My Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
};

export default DashboardNavbar;
