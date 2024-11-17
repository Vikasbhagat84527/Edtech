import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DashboardClient from "./DashboardClient";
import Sidebar from "@/src/components/Sidebar";
import Navbar from "@/src/components/Navbar";
import DashboardContent from "@/src/components/DashboardContent";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div>
      <DashboardClient session={session} />
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <DashboardContent />
        </div>
      </div>
    </div>
  );
}
