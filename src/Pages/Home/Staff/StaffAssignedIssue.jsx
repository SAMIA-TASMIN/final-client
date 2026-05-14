import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import LoadingPage from "../LoadingPage";
import IssuesTableSkeleton from "../IssuesTableSkeleton ";

const StaffAssignedIssue = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================
  // THEME STATE & LISTENER
  // ============================
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "civicLight"
  );
  const isLight = theme === "civicLight";

  useEffect(() => {
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem("theme") || "civicLight";
      if (newTheme !== theme) setTheme(newTheme);
    };
    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, [theme]);

  // ============================
  // THEME-AWARE CLASS CALCULATION
  // ============================
  const bgClass = isLight ? "bg-gray-100" : "bg-gray-950";
  const titleClass = isLight ? "text-blue-800" : "text-blue-400"; // Adjusted for better dark mode contrast
  const textClass = isLight ? "text-gray-700" : "text-gray-300";
  const noIssueTextClass = isLight ? "text-blue-700" : "text-blue-300";
  const tableBgClass = isLight ? "bg-white" : "bg-gray-900";
  const tableHeaderBgClass = isLight ? "bg-gray-200" : "bg-700";
  const tableRowBgClass = isLight
    ? "bg-white hover:bg-gray-50"
    : "bg-gray-800 hover:bg-gray-700";

  // Fetch assigned issues
  useEffect(() => {
    if (!user?.email) return;

    const fetchIssues = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/staff/issues/${user.email}`);
        setIssues(res.data);
      } catch (err) {
        console.error("Error fetching assigned issues:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [user?.email, axiosSecure]);

  // Update issue status logic
  const updateStatus = async (id, action) => {
    try {
      let status, message;

      switch (action) {
        case "Accept":
          status = "In-Progress";
          message = `Issue accepted by Staff: ${user.email}`;
          break;
        case "Start":
          status = "Working";
          message = `Staff started working on the issue`;
          break;
        case "Resolve":
          status = "Resolved";
          message = `Issue resolved by Staff: ${user.email}`;
          break;
        case "Reject":
          status = "Rejected";
          message = `Staff rejected the issue`;
          break;
        default:
          return;
      }

      const res = await axiosSecure.patch(`/staff/issues/${id}/status`, {
        status,
        message,
      });

      // Update local state with the new issue data from the response
      setIssues((prev) =>
        prev.map((issue) => (issue._id === id ? res.data : issue))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Helper to get Tailwind status colors (adjusted for dark mode visibility)
  const getStatusClasses = (status) => {
    const base = "px-3 py-1 rounded-full text-sm font-semibold";
    switch (status) {
      case "Pending":
        return `${base} bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200`;
      case "In-Progress":
        return `${base} bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200`;
      case "Working":
        return `${base} bg-indigo-200 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200`;
      case "Resolved":
        return `${base} bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200`;
      case "Rejected":
        return `${base} bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200`;
      default:
        return `${base} bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
    }
  };

  if (loading) return <IssuesTableSkeleton />;

  return (
    <div className={`p-6 min-h-screen ${bgClass}`}>
      <h2 className={`text-3xl font-bold mb-6 ${titleClass} text-center`}>
        Assigned Issues
      </h2>

      {issues.length === 0 ? (
        <div className={`text-center py-8 ${noIssueTextClass}`}>
          No assigned issues
        </div>
      ) : (
        <div className="overflow-x-auto max-w-7xl mx-auto">
          <table
            className={`min-w-full border-collapse ${tableBgClass} rounded-lg shadow-xl`}
          >
            <thead>
              <tr className={`${tableHeaderBgClass} text-left ${titleClass}`}>
                <th className="px-4 py-3 rounded-tl-lg">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr
                  key={issue._id}
                  className={`${tableRowBgClass} border-b ${
                    isLight ? "border-gray-200" : "border-gray-700"
                  }`}
                >
                  {/* Issue Title */}
                  <td
                    className={`px-4 py-3 font-medium ${
                      isLight ? "text-gray-900" : "text-gray-100"
                    }`}
                  >
                    {issue.title}
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3">
                    <span className={getStatusClasses(issue.status)}>
                      {issue.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 flex flex-wrap gap-2">
                    {issue.status === "Pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(issue._id, "Accept")}
                          className="px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(issue._id, "Reject")}
                          className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {issue.status === "In-Progress" && (
                      <button
                        onClick={() => updateStatus(issue._id, "Start")}
                        className="px-3 py-1 rounded-lg bg-yellow-500 text-gray-900 hover:bg-yellow-600 transition font-medium"
                      >
                        Start Work
                      </button>
                    )}
                    {issue.status === "Working" && (
                      <button
                        onClick={() => updateStatus(issue._id, "Resolve")}
                        className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        Resolve
                      </button>
                    )}
                    {issue.status === "Rejected" && (
                      <span className="text-red-600 font-semibold dark:text-red-400">
                        Rejected
                      </span>
                    )}
                    {issue.status === "Resolved" && (
                      <span className="text-green-600 font-semibold dark:text-green-400">
                        Resolved
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffAssignedIssue;
