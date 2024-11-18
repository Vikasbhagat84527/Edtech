import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DashboardClient from "./DashboardClient";
import DashboardSidebar from "@/src/components/DashboardSidebar";
import DashboardNavbar from "@/src/components/DashboardNavbar";
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
        <DashboardSidebar />
        <div className="flex-1">
          <DashboardNavbar />
          <DashboardContent />
        </div>
      </div>
    </div>
  );
}
