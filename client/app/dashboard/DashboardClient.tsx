"use client";

import { signOut } from "next-auth/react";

export default function DashboardClient({ session }: { session: any }) {
  return (
    <div>
      <button
        onClick={() =>
          signOut({
            callbackUrl: "/auth/login",
          })
        }
      >
        Sign Out
      </button>
    </div>
  );
}
