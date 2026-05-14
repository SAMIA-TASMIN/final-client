import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { Link } from "react-router-dom"; // Link should be imported from 'react-router-dom'
import LoadingPage from "../../Pages/Home/LoadingPage"; // Import LoadingPage

const AdminDashboard = () => {
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
  const isLight = theme === "civicLight";
  const titleClass = isLight ? "text-gray-900" : "text-blue-700";
  const subTitleClass = isLight ? "text-gray-700" : "text-gray-300";
  const cardBgClass = isLight ? "bg-white" : "bg-gray-900";
  const cardBorderClass = isLight ? "border-gray-200" : "border-gray-700";
  const tableHoverClass = isLight ? "hover:bg-gray-50" : "hover:bg-gray-800";

  // Theme-aware status color helper function
  const statusColor = (status) => {
    if (isLight) {
      switch (status) {
        case "Pending":
          return "bg-yellow-100 text-yellow-700 border-yellow-300";
        case "Resolved":
          return "bg-green-100 text-green-700 border-green-300";
        case "Rejected":
          return "bg-red-100 text-red-700 border-red-300";
        default:
          return "bg-gray-100 text-gray-700 border-gray-300";
      }
    } else {
      switch (status) {
        case "Pending":
          return "bg-yellow-900 text-yellow-300 border-yellow-700";
        case "Resolved":
          return "bg-green-900 text-green-300 border-green-700";
        case "Rejected":
          return "bg-red-900 text-red-300 border-red-700";
        default:
          return "bg-gray-700 text-gray-300 border-gray-600";
      }
    }
  };

  // ============================
  // DATA FETCHING
  // ============================
  const axiosSecure = useAxiosSecure();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/stats");
      return res.data;
    },
  });

  if (isLoading) return <LoadingPage />;

  return (
    <div className={`p-6 space-y-8 `}>
      {/* HEADER */}
      <h1 className={`text-3xl font-bold tracking-tight ${titleClass}`}>
        Admin Dashboard
      </h1>

      <Link
        to="/dashboard/allIssuesAdmin"
        className="text-white p-5 h-[100px] rounded-xl text-3xl font-bold btn btn-primary"
      >
        Issue Management
      </Link>

      {/* MAIN STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Total Issues", value: stats.totalIssues },
          { title: "Resolved Issues", value: stats.resolved },
          { title: "Pending Issues", value: stats.pending },
          { title: "Rejected Issues", value: stats.rejected },
          {
            title: "Total Payments",
            value: (stats.totalPayments || 0) + " tk",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            // Apply theme-aware background, border, and shadow
            className={`${cardBgClass} rounded-xl shadow-md p-5 border ${cardBorderClass} ${tableHoverClass} transition-all`}
          >
            <h2 className={`font-medium ${subTitleClass}`}>{item.title}</h2>
            <p className={`text-3xl font-bold mt-2 ${titleClass}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* 3 COLUMN TABLE SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LATEST ISSUES TABLE */}
        <div
          className={`${cardBgClass} shadow-lg rounded-xl border ${cardBorderClass} p-6`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${titleClass}`}>
            Latest Issues
          </h3>

          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${cardBorderClass} ${subTitleClass}`}>
                <th className="py-2 text-left">Title</th>
                <th className="py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.latestIssues?.map((i) => (
                <tr
                  key={i._id}
                  className={`border-b ${cardBorderClass} ${tableHoverClass} transition ${subTitleClass}`}
                >
                  <td className={`py-2 font-medium ${titleClass}`}>
                    {i.title}
                  </td>
                  <td className="py-2">
                    <span
                      // Status badge uses the theme-aware helper function
                      className={`px-2 py-1 text-xs rounded-full border ${statusColor(
                        i.status
                      )}`}
                    >
                      {i.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* LATEST PAYMENTS TABLE */}
        <div
          className={`${cardBgClass} shadow-lg rounded-xl border ${cardBorderClass} p-6`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${titleClass}`}>
            Latest Payments
          </h3>

          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${cardBorderClass} ${subTitleClass}`}>
                <th className="py-2 text-left">User</th>
                <th className="py-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {stats.latestPayments?.map((p) => (
                <tr
                  key={p._id}
                  className={`border-b ${cardBorderClass} ${tableHoverClass} transition ${subTitleClass}`}
                >
                  <td className="py-2">{p.email}</td>
                  <td className={`py-2 font-semibold ${titleClass}`}>
                    {p.amount} tk
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* LATEST USERS TABLE */}
        <div
          className={`${cardBgClass} shadow-lg rounded-xl border ${cardBorderClass} p-6`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${titleClass}`}>
            Latest Users
          </h3>

          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${cardBorderClass} ${subTitleClass}`}>
                <th className="py-2 text-left">Name</th>
              </tr>
            </thead>
            <tbody>
              {stats.latestUsers?.map((u) => (
                <tr
                  key={u.email}
                  className={`border-b ${cardBorderClass} ${tableHoverClass} transition ${subTitleClass}`}
                >
                  <td className={`py-2 font-medium ${titleClass}`}>
                    {u.displayName || u.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
