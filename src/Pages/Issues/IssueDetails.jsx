import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingPage from "../Home/LoadingPage";
import { AuthContext } from "../../Contexts/AuthContext";
import Timeline from "./Timeline";
import Swal from "sweetalert2";
import IssueDetailsSkeleton from "../Home/IssueDetailsSkeleton";

const IssueDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [boosting, setBoosting] = useState(false); // Unused state, kept for completeness

  // ============================
  // THEME STATE & LISTENER
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
  // THEME-AWARE CLASS CALCULATION
  // ============================
  const titleClass = theme === "civicLight" ? "text-gray-800" : "text-gray-100";
  const infoTextClass =
    theme === "civicLight" ? "text-gray-600" : "text-gray-400";
  const cardBgClass = theme === "civicLight" ? "bg-white" : "bg-gray-900";
  const cardBorderClass =
    theme === "civicLight" ? "border-gray-200" : "border-gray-700";

  // Static color definitions (already good, just moved to avoid repetition)
  const statusColorMap = {
    Pending: "bg-yellow-500",
    "In-Progress": "bg-blue-500",
    Resolved: "bg-green-600",
    Closed: "bg-gray-700",
  };

  const priorityColorMap = {
    Normal: "bg-gray-500",
    High: "bg-red-600",
    Critical: "bg-red-700",
  };

  // ============================
  // DATA FETCHING & HANDLERS
  // ============================
  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await axiosSecure.get(`/issues/${id}`);
        setIssue(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id, axiosSecure]); // Added axiosSecure dependency

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      try {
        await axiosSecure.delete(`/issues/${id}`);
        Swal.fire({
          title: "Issue Deleted Successfully!",
          text: "The issue has been permanently removed.",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/my-issues");
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: "Deletion Failed!",
          text: "Could not delete the issue.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  if (loading) return <IssueDetailsSkeleton />;
  if (!issue)
    return (
      <p className={`py-20 text-center text-xl ${titleClass}`}>
        Issue not found.
      </p>
    );

  const isOwner = user && user.email === issue.userEmail;
  const canEdit = isOwner && issue.status === "Pending";
  const canBoost = isOwner && issue.priority !== "High";

  // Dynamic color classes based on issue data
  const statusColor = statusColorMap[issue.status];
  const priorityColor = priorityColorMap[issue.priority];

  return (
    <div className={`max-w-full py-22 mx-auto px-4 ${cardBgClass}`}>
      <button
        onClick={() => navigate(-1)}
        className={`btn rounded-xl p-3 bg-blue-600 mb-6 ${titleClass} border ${cardBorderClass}`}
      >
        ← Go Back
      </button>

      {/* Main Content Card */}
      <div
        className={`${cardBgClass} ${cardBorderClass} shadow-lg rounded-lg p-6 space-y-6 border`}
      >
        {/* Image */}
        {issue.image && (
          <img
            src={issue.image}
            alt={issue.title}
            className="w-full h-80 object-cover rounded mb-6"
          />
        )}

        {/* Title + Status + Priority */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <h1 className={`text-3xl font-bold ${titleClass}`}>{issue.title}</h1>
          <div className="flex gap-2 flex-wrap">
            <span
              className={`px-4 py-1 rounded-full text-white font-semibold ${statusColor}`}
            >
              {issue.status}
            </span>
            <span
              className={`px-4 py-1 rounded-full text-white font-semibold ${priorityColor}`}
            >
              {issue.priority} Priority
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-5 ${infoTextClass}`}
        >
          <p className="font-semibold">
            <span className="font-bold">Category:</span> {issue.category}
          </p>
          <p className="font-semibold">
            <span className="font-bold">Location:</span>{" "}
            {issue.reporterDistrict}
          </p>
          <p className="font-semibold">
            <span className="font-bold">Created At:</span>{" "}
            {new Date(issue.createdAt).toLocaleString()}
          </p>
          <p className="font-semibold">
            <span className="font-bold">Last Updated:</span>{" "}
            {issue.updatedAt
              ? new Date(issue.updatedAt).toLocaleString()
              : "Not updated yet"}
          </p>
          {issue.assignedStaff && (
            <p className="font-semibold">
              <span className="font-bold">Assigned Staff:</span>{" "}
              {issue.assignedStaff.name} ({issue.assignedStaff.email})
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <h2 className={`text-xl font-bold mb-2 ${titleClass}`}>
            Description
          </h2>
          <p className={`font-semibold ${infoTextClass}`}>
            {issue.description}
          </p>
        </div>

        {/* Action Buttons (Colors are static/strong, so no change needed) */}
        <div className="flex flex-wrap gap-3 mt-4">
          {canEdit && (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => navigate(`/edit-issue/${id}`)}
            >
              Edit Issue
            </button>
          )}
          {isOwner && (
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              onClick={handleDelete}
            >
              Delete Issue
            </button>
          )}
          {canBoost && (
            <Link
              to={`/boost-payment/${id}`}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Boost Priority
            </Link>
          )}
        </div>

        {/* Timeline */}
        <div className="mt-6">
          <h2 className={`text-xl font-bold mb-2 ${titleClass}`}>
            Issue Timeline
          </h2>
          {/* Assuming Timeline component handles its own theme styling */}
          <Timeline timeline={issue.timeline} />
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
