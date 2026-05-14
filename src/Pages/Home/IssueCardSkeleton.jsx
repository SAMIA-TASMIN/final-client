import React, { useEffect, useState } from "react";

const IssueCardSkeleton = ({ count = 3 }) => {
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

  // Card/Container styles
  const cardBgClass = isLight ? "bg-white" : "bg-gray-800";
  const cardBorderClass = isLight ? "border-gray-200" : "border-gray-700";

  // Placeholder elements (Title, image, etc.) styles
  const placeholderBgLight = "bg-gray-300";
  const placeholderBgDark = "bg-gray-700";
  const placeholderBgClass = isLight ? placeholderBgLight : placeholderBgDark;

  return (
    <div
      className={`h-screen max-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${cardBgClass} gap-6`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          // Apply explicit theme classes
          className={`rounded-xl p-5 border ${cardBorderClass} ${cardBgClass} shadow animate-pulse`}
        >
          {/* Image Skeleton */}
          <div
            className={`h-40 w-full ${placeholderBgClass} rounded-xl mb-4`}
          ></div>

          {/* Title */}
          <div className={`h-4 w-3/4 ${placeholderBgClass} rounded mb-2`}></div>

          {/* Description */}
          <div
            className={`h-3 w-full ${placeholderBgClass} rounded mb-2`}
          ></div>
          <div className={`h-3 w-5/6 ${placeholderBgClass} rounded mb-4`}></div>
        </div>
      ))}
    </div>
  );
};

export default IssueCardSkeleton;
