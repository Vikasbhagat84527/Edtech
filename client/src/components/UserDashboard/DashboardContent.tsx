"use client";

import React from "react";
import WatchHistory from "./WatchHistory";
import BookmarkedVideos from "./BookmarkedVideos";
import LikedVideos from "./LikedVideos";

const DashboardContent: React.FC = () => {
  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg flex flex-col items-center justify-between">
          <WatchHistory />
        </div>
        <div className="bg-white shadow-md rounded-lg flex flex-col items-center justify-between">
          <LikedVideos />
        </div>
        <div className="bg-white shadow-md rounded-lg flex flex-col items-center justify-between">
          <BookmarkedVideos />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
