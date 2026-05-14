import React, { useEffect, useState } from "react";

// Helper function now receives the theme to return theme-specific colors
const statusColor = (status, theme) => {
  // Define base text color based on status color (e.g., text-yellow-800)
  const textColors = {
    Pending: "text-yellow-800",
    "In-Progress": "text-blue-800",
    Resolved: "text-green-800",
    Closed: "text-gray-800",
    default: "text-gray-800",
  };

  // Define background/border based on theme
  if (theme === "civicLight") {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In-Progress":
        return "bg-blue-100 text-blue-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  } else {
    // Dark Mode
    switch (status) {
      case "Pending":
        return "bg-yellow-900 text-yellow-300"; // Darker background, lighter text
      case "In-Progress":
        return "bg-blue-900 text-blue-300";
      case "Resolved":
        return "bg-green-900 text-green-300";
      case "Closed":
        return "bg-gray-700 text-gray-300";
      default:
        return "bg-gray-700 text-gray-300";
    }
  }
};

const Timeline = ({ timeline }) => {
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
  const cardBgClass = theme === "civicLight" ? "bg-white" : "bg-gray-800";
  const borderClass =
    theme === "civicLight" ? "border-gray-200" : "border-gray-700";

  // ============================
  // TIMELINE LOGIC
  // ============================
  const sorted = [...(timeline || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  if (sorted.length === 0)
    return <p className={infoTextClass}>No timeline entries yet.</p>;

  return (
    <div className="relative">
      {/* Vertical Line */}
      <div
        className={`border-l-2 ${borderClass} absolute h-full left-4 top-0`}
      ></div>

      <ul className="space-y-6 pl-8">
        {sorted.map((it, idx) => (
          <li key={idx} className="relative">
            {/* Dot (Primary color usually works in both themes) */}
            <div className="absolute -left-6 top-0 w-3 h-3 rounded-full bg-primary"></div>

            {/* Timeline Item Card */}
            <div
              className={`${cardBgClass} p-4 rounded-lg shadow-sm border ${borderClass}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Status Badge - uses theme-aware helper function */}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(
                      it.status,
                      theme
                    )}`}
                  >
                    {it.status || "Update"}
                  </span>
                  {/* Message */}
                  <span className={`text-sm ${titleClass}`}>{it.message}</span>
                </div>

                <div className={`text-right text-xs ${infoTextClass}`}>
                  {/* Updated By */}
                  <div>{it.updatedBy || "System"}</div>
                  {/* Date */}
                  <div className="mt-1">
                    {new Date(it.date).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Timeline;
