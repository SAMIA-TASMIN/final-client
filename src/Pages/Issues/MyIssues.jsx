import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingPage from "../Home/LoadingPage";
import Swal from "sweetalert2";
import IssueCardSkeleton from "../Home/IssueCardSkeleton";

const MyIssues = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

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

  // ============================
  // THEME-AWARE CLASS CALCULATION (Matching LatestResolvedIssues/AllIssues)
  // ============================
  const titleClass = theme === "civicLight" ? "text-gray-800" : "text-gray-100";
  const infoTextClass =
    theme === "civicLight" ? "text-gray-600" : "text-gray-400";
  const cardBgClass = theme === "civicLight" ? "bg-white" : "bg-gray-900";
  const cardBorderClass =
    theme === "civicLight" ? "border-gray-200" : "border-gray-700";

  const filterBorderClass = "border-2 border-blue-600 rounded-xl";

  // ============================
  // DATA FETCHING & HANDLERS
  // ============================
  useEffect(() => {
    if (!user) return;
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/issues/my-issues`);
        setIssues(res.data);
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: "Failed to fetch issues!",
          text: "Action completed successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [user, axiosSecure]); // Added axiosSecure dependency

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    try {
      await axiosSecure.delete(`/issues/${id}`);
      setIssues(issues.filter((issue) => issue._id !== id));
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Failed to delete issues!",
        text: "Action completed successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    }
  };

  const filteredIssues = issues
    .filter((i) => !statusFilter || i.status === statusFilter)
    .filter((i) => !categoryFilter || i.category === categoryFilter);

  // ============================
  // RENDER LOGIC
  // ============================
  if (!user || loading) {
    return <IssueCardSkeleton />;
  }

  return (
    <div className={`p-6 ${cardBgClass}`}>
      {/* Title */}
      <h2 className={`text-2xl font-bold ${titleClass} mb-4`}>My Issues</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          // Apply theme-aware background, text, and blue border
          className={`select p-2 ${filterBorderClass} ${infoTextClass} ${cardBgClass}`}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In-Progress">In-Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          // Apply theme-aware background, text, and blue border
          className={`select p-2 ${filterBorderClass} ${infoTextClass} ${cardBgClass}`}
        >
          <option value="">All Categories</option>
          <option value="Broken Streetlight">Broken Streetlight</option>
          <option value="Pothole">Pothole</option>
          <option value="Water Leakage">Water Leakage</option>
          <option value="Garbage Overflow">Garbage Overflow</option>
          <option value="Damaged Footpath">Damaged Footpath</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Issues List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredIssues.map((issue) => (
          <div
            key={issue._id}
            // Apply theme-aware card background, border, and shadow
            className={`p-4 border ${cardBorderClass} ${cardBgClass} rounded shadow`}
          >
            {issue.image && (
              <img
                src={issue.image}
                alt={issue.title}
                className="w-full h-48 object-cover mb-3 rounded"
              />
            )}
            <h3 className={`font-bold text-lg ${titleClass}`}>{issue.title}</h3>
            <p className={`text-sm mb-2 ${infoTextClass}`}>
              {issue.description}
            </p>

            <p className={infoTextClass}>
              <span className="font-semibold">Status:</span> {issue.status}
            </p>
            <p className={infoTextClass}>
              <span className="font-semibold">Category:</span> {issue.category}
            </p>
            <p className={infoTextClass}>
              <span className="font-semibold">Location:</span> {issue.location}
            </p>

            <div className="mt-4 flex gap-2">
              {/* DaisyUI buttons (btn-warning, btn-error, btn-primary) are theme-aware */}
              {issue.status === "Pending" && (
                <button
                  onClick={() => navigate(`/edit-issue/${issue._id}`)}
                  className="btn btn-sm btn-warning bg-blue-600 rounded-lg text-white px-3 py-1"
                >
                  Edit
                </button>
              )}
              {issue.status === "Pending" && (
                <button
                  onClick={() => handleDelete(issue._id)}
                  className="btn btn-sm btn-warning bg-blue-600 rounded-lg text-white px-3 py-1"
                >
                  Delete
                </button>
              )}
              <Link
                to={`/viewDetails/${issue._id}`}
                className="btn btn-sm btn-warning bg-blue-600 rounded-lg text-white px-3 py-1"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}

        {filteredIssues.length === 0 && !loading && (
          <p className={`col-span-full text-center text-xl ${infoTextClass}`}>
            No issues found matching your filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyIssues;
