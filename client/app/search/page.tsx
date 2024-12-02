"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Fuse from "fuse.js";
import axiosInstance from "@/src/utils/axiosInstance";

interface VideoResult {
  id: number;
  title: string;
  description: string;
}

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase();
  const [results, setResults] = useState<VideoResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      try {
        const response = await axiosInstance.get<VideoResult[]>(
          `/api/lessons/search?search=${query}`
        );
        const fuse = new Fuse(response.data, {
          keys: ["title", "description"],
          includeScore: true,
          threshold: 0.4,
        });

        const fuzzyResults: VideoResult[] = fuse
          .search(query)
          .map((result) => result.item);
        setResults(fuzzyResults);
      } catch (error) {
        console.log("Error fetching search results:", error);
      }
    };

    fetchResults();
  }, [query]);

  const totalResults = results.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const paginatedResults = results.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Search Results</h1>

      {query && (
        <p className="text-lg text-gray-600 mb-6">
          Displaying results for{" "}
          <span className="font-semibold">"{query}"</span>:
        </p>
      )}

      <div className="grid gap-6">
        {paginatedResults.length > 0 ? (
          paginatedResults.map((result) => (
            <div
              key={result.id}
              className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {result.title}
              </h2>
              <p className="text-gray-600">{result.description}</p>
            </div>
          ))
        ) : (
          <p className="text-lg text-gray-600">
            {query
              ? `No results found for "${query}". Please try searching for something else.`
              : "Please enter a search term to view results."}
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-4 py-2 rounded-full ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
