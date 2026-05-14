import React, { useState, useMemo, useEffect } from "react";
// Import useQuery from TanStack Query
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import { FaLocationPin } from "react-icons/fa6";
import { FaVoteYea } from "react-icons/fa";
import Footer from "../Home/Footer";
import LoadingPage from "../Home/LoadingPage";
import IssueCardSkeleton from "../Home/IssueCardSkeleton";

// Define pagination constant and set it up for server-side control
const ITEMS_PER_PAGE = 12;

const AllIssues = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // ============================
  // THEME STATE & LISTENER (The Fix)
  // ============================
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "civicLight"
  );

  useEffect(() => {
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem("theme") || "civicLight";
      if (newTheme !== theme) {
        setTheme(newTheme);
      }
    };
    window.addEventListener("storage", handleThemeChange);
    return () => {
      window.removeEventListener("storage", handleThemeChange);
    };
  }, [theme]);

  // 1. State for Filters, Search, and Pagination
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Page number

  // 2. Function to build the URL query string
  const createQueryString = useMemo(() => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (status) params.append("status", status);
    if (priority) params.append("priority", priority);
    if (search) params.append("search", search);

    // Pagination parameters for the server
    params.append("page", currentPage);
    params.append("limit", ITEMS_PER_PAGE);

    return params.toString();
  }, [category, status, priority, search, currentPage]);

  // 3. TanStack Query for data fetching
  const {
    data: issuesData = {},
    isLoading,
    isError,
    refetch,
  } = useQuery({
    // queryKey includes all dependencies to trigger refetch
    queryKey: ["allIssues", createQueryString],
    queryFn: async () => {
      const res = await axiosSecure.get(`/issues?${createQueryString}`);
      return res.data;
    },
  });

  // Extract data from the server response
  const currentIssues = issuesData.issues || [];
  const totalIssues = issuesData.totalIssues || 0;
  const totalPages = Math.ceil(totalIssues / ITEMS_PER_PAGE);

  // ============================
  // PAGINATION HANDLERS
  // ============================
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handler for filter/search changes - always resets page to 1
  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  // ============================
  // UPVOTE FUNCTION (using refetch)
  // ============================
  const handleUpvote = async (id) => {
    if (!user) return (window.location.href = "/login");

    try {
      await axiosSecure.patch(`/issues/upvote/${id}`);
      refetch();
      Swal.fire("Success!", "Issue upvoted successfully.", "success");
    } catch (err) {
      console.log(err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to upvote",
        "error"
      );
    }
  };

  // ============================
  // THEME-AWARE CLASS CALCULATION
  // (Matching LatestResolvedIssues for consistency)
  // ============================
  const titleClass = theme === "civicLight" ? "text-gray-800" : "text-gray-100";
  const infoTextClass =
    theme === "civicLight" ? "text-gray-600" : "text-gray-400";
  const cardBgClass = theme === "civicLight" ? "bg-white" : "bg-gray-900";
  const cardBorderClass =
    theme === "civicLight" ? "border-gray-500" : "border-gray-700";
  const upvoteButtonClass =
    theme === "civicLight"
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-blue-800 hover:bg-blue-700 text-white";
  const detailButtonClass =
    theme === "civicLight"
      ? "bg-green-600 hover:bg-green-700 text-white"
      : "bg-green-800 hover:bg-green-700 text-white";

  // ============================
  // RENDER LOGIC
  // ============================
  if (isLoading) {
    return <IssueCardSkeleton />;
  }

  const noResults = currentIssues.length === 0 && totalIssues === 0;

  return (
    <div className={`max-w-full mx-auto p-5 ${cardBgClass}`}>
      {/* Title */}
      <h1 className={`text-3xl font-bold ${titleClass} mb-5`}>All Issues</h1>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        {/* Category Select */}
        <select
          className={`select border-2 p-2 border-gray-600 rounded-xl ${infoTextClass} ${cardBgClass}`}
          onChange={(e) => handleFilterChange(setCategory, e.target.value)}
          value={category}
        >
          <option value="">Category (All)</option>
          <option value="Broken Streetlight">Broken Streetlight</option>
          <option value="Pothole">Pothole</option>
          <option value="Water Leakage">Water Leakage</option>
          <option value="Garbage Overflow">Garbage Overflow</option>
          <option value="Damaged Footpath">Damaged Footpath</option>
          <option value="Other">Other</option>
        </select>

        {/* Status Select */}
        <select
          className={`select border-2 p-2 border-gray-600 rounded-xl ${infoTextClass} ${cardBgClass}`}
          onChange={(e) => handleFilterChange(setStatus, e.target.value)}
          value={status}
        >
          <option value="">Status (All)</option>
          <option value="Pending">Pending</option>
          <option value="In-Progress">In-Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        {/* Priority Select */}
        <select
          className={`select border-2 p-2 border-gray-600 rounded-xl ${infoTextClass} ${cardBgClass}`}
          onChange={(e) => handleFilterChange(setPriority, e.target.value)}
          value={priority}
        >
          <option value="">Priority (All)</option>
          <option value="High">High</option>
          <option value="Normal">Normal</option>
        </select>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search issues (Title, Location)..."
          className={`input border-2 p-2 border-gray-600 rounded-xl w-full ${titleClass} ${cardBgClass}`}
          onChange={(e) => handleFilterChange(setSearch, e.target.value)}
          value={search}
        />
      </div>

      {/* Issue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentIssues.map((issue) => (
          <div
            key={issue._id}
            // Apply calculated card style
            className={`${cardBgClass} ${cardBorderClass} border p-4 rounded-lg shadow`}
          >
            <img
              src={issue.image}
              className="h-40 w-full object-cover rounded"
              alt={issue.title}
            />

            {/* Apply calculated text classes */}
            <h2 className={`text-xl font-semibold mt-2 ${titleClass}`}>
              {issue.title}
            </h2>
            <p className={`text-sm ${infoTextClass}`}>{issue.category}</p>

            <p
              className={`text-sm font-bold mt-1 ${
                issue.priority === "High" ? "text-red-500" : "text-green-500" // Keep static colors for urgency
              }`}
            >
              Priority: {issue.priority}
            </p>

            {/* Apply calculated info class */}
            <p className={`mt-1 ${infoTextClass}`}>
              <FaLocationPin className="inline mr-1" />
              {issue.reporterDistrict}, {issue.reporterRegion}
            </p>

            <div className="flex justify-between mt-3 items-center">
              <button
                onClick={() => handleUpvote(issue._id)}
                // Apply calculated upvote button style
                className={`${upvoteButtonClass} px-3 py-1 rounded flex items-center gap-1 transition`}
              >
                <FaVoteYea /> {issue.upvotes}
              </button>

              <Link
                to={`/viewDetails/${issue._id}`}
                // Apply calculated detail button style
                className={`${detailButtonClass} px-3 py-1 rounded transition`}
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            // DaisyUI 'btn' and 'btn-primary' handle coloring automatically
            className={`btn ${
              currentPage === 1
                ? "btn-disabled"
                : "btn-primary bg-blue-600 rounded-lg text-white px-3 py-1"
            }`}
          >
            Previous
          </button>

          {/* Applying the main text color class */}
          <span className={`text-lg font-medium ${titleClass}`}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`btn ${
              currentPage === totalPages
                ? "btn-disabled"
                : "btn-primary bg-blue-600 rounded-lg text-white px-3 py-1"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Handle no results after filtering/searching */}
      {noResults && !isLoading && (
        <div className={`text-center mt-8 text-xl ${infoTextClass}`}>
          No issues found matching the criteria.
        </div>
      )}
      <Footer />
    </div>
  );
};

export default AllIssues;
