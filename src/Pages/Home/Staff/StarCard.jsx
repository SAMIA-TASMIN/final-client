import React, { useEffect, useState } from "react";

const StatCard = ({ title, value }) => {
  // ============================
  // THEME STATE & LISTENER
  // ============================
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "civicLight"
  );

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
  const isLight = theme === "civicLight";
  const cardBg = isLight ? "bg-white" : "bg-gray-700";
  const titleClass = isLight ? "text-gray-500" : "text-gray-300";
  const valueClass = isLight ? "text-gray-900" : "text-gray-100";

  return (
    <div className={`${cardBg} p-6 rounded-xl shadow`}>
      {/* Title - Muted text color */}
      <h4 className={`text-sm ${titleClass}`}>{title}</h4>

      {/* Value - Strong contrast color */}
      <p className={`text-3xl font-bold mt-2 ${valueClass}`}>{value ?? 0}</p>
    </div>
  );
};

export default StatCard;
