import React from "react";
import UserSection from "@/src/components/UserDashboard/UserSection";
import DashboardContent from "@/src/components/UserDashboard/DashboardContent";

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
        <UserSection />
        <DashboardContent />
      </div>
    </div>
  );
};

export default DashboardPage;
