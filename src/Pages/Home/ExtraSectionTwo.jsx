import React, { useEffect, useState } from "react";

const ExtraSectionTwo = () => {
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

  // 3. MANUAL CLASS CALCULATION (Matching LatestResolvedIssues)
  const titleClass = theme === "civicLight" ? "text-gray-800" : "text-gray-100";
  const descClass = theme === "civicLight" ? "text-gray-500" : "text-gray-400";
  const cardBgClass = theme === "civicLight" ? "bg-white" : "bg-gray-900"; // Assuming bg-base-100 is bg-white
  const cardLabelClass =
    theme === "civicLight" ? "text-gray-800" : "text-gray-100";

  return (
    <section className={`py-16 ${cardBgClass}`}>
      <div className="max-w-6xl mx-auto text-center px-4">
        {/* Apply calculated class for the title */}
        <h2 className={`text-3xl font-bold ${titleClass} mb-4`}>
          Our Community Impact
        </h2>
        {/* Apply calculated class for the description */}
        <p className={`${descClass} max-w-3xl mx-auto mb-6`}>
          Thousands of citizens are actively using the platform to make their
          roads cleaner, safer, and more efficient.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {[
            { number: "1500+", label: "Issues Reported" },
            { number: "1200+", label: "Resolved Successfully" },
            { number: "5,000+", label: "Active Users" },
          ].map((item, idx) => (
            <div
              key={idx}
              // Apply calculated background class
              className={`p-6 ${cardBgClass} shadow-md border-2 border-blue-300 dark:border-blue-700 rounded-xl hover:shadow-xl transition`}
            >
              {/* Accent color should switch automatically with the theme */}
              <h3 className="text-4xl font-bold text-accent">{item.number}</h3>
              {/* Apply calculated class for the label */}
              <p className={`mt-2 ${cardLabelClass} font-bold`}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExtraSectionTwo;
