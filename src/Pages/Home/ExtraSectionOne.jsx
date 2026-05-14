import React, { useEffect, useState } from "react";

const ExtraSectionOne = () => {
  // 1. Initialize local theme state
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "civicLight"
  );

  // 2. Add event listener for instant re-render
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

  // 3. MANUAL CLASS CALCULATION
  const cardBgClass = theme === "civicLight" ? "bg-gray-200" : "bg-gray-900";

  const titleClass = theme === "civicLight" ? "text-gray-800" : "text-gray-100";
  const descClass = theme === "civicLight" ? "text-gray-500" : "text-gray-400"; // Use the info/desc class from LatestResolvedIssues

  return (
    <section className={`py-16 ${cardBgClass}`}>
      <div className="max-w-5xl mx-auto text-center px-4">
        {/* Apply calculated class for the title */}
        <h2 className={`text-3xl font-bold ${titleClass} mb-4`}>
          Why Choose Our Platform?
        </h2>
        {/* Apply calculated class for the description */}
        <p className={`${descClass} font-semibold max-w-3xl mx-auto`}>
          We make public issue reporting fast, transparent, and effective.
          Citizens can help improve their community and authorities can manage
          tasks more efficiently.
        </p>
      </div>
    </section>
  );
};

export default ExtraSectionOne;
