"use client";

import Link from "next/link";

const DashboardSidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-4">
      <ul className="space-y-4">
        <li>
          <Link
            href="/dashboard"
            className="block p-2 hover:bg-gray-700 rounded"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/favorites"
            className="block p-2 hover:bg-gray-700 rounded"
          >
            Favorites
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/analytics"
            className="block p-2 hover:bg-gray-700 rounded"
          >
            Analytics
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default DashboardSidebar;
